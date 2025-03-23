"use server";

import { createAdminClient, createSessionClient } from "@/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";

import { envConfig } from "@/config";
import { defaultAvatar } from "@/constants";

export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const { documents: user } = await databases.listDocuments(envConfig.databaseId!, envConfig.usersCollectionId!, [
    Query.equal("email", email),
    Query.limit(1),
  ]);

  return user.length ? user[0] : null;
};

export const verifySecret = async (accountId: string, password: string) => {
  try {
    const { account } = await createAdminClient();

    console.log(accountId, "this is secret");
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    console.log(session, "session ONly");
    console.log((await cookies()).get("appwrite-session"), "this is ession", session.secret);
    return { sessionId: session.$id };
  } catch (error) {
    console.log("are you here err", error);
    throw error;
  }
};

export const sendEmailOtp = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session && session.userId;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();
    console.log(result, "here is result");

    const { documents } = await databases.listDocuments(envConfig.databaseId!, envConfig.usersCollectionId!, [
      Query.equal("accountId", result.$id),
    ]);

    if (!documents.length) return null;

    return documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  const { account } = await createSessionClient();

  try {
    await Promise.all([account.deleteSession("current"), (await cookies()).delete("appwrite-session")]);
  } catch (error) {
    throw error;
  } finally {
    redirect("/sign-in");
  }
};

export const login = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    console.log(existingUser?.accountId);

    if (existingUser) {
      await sendEmailOtp(email);
      return { accountId: existingUser.accountId };
    }

    return { accountId: null, error: "User not found" };
  } catch (error) {
    throw error;
  }
};

export const signUp = async ({ fullName, email }: { fullName: string; email: string }) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOtp(email);
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(envConfig.databaseId!, envConfig.usersCollectionId!, ID.unique(), {
      fullName,
      email,
      avatar: defaultAvatar,
      accountId,
    });
  }

  return { accountId };
};
