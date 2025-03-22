import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

import { envConfig } from "@/config";
import { cookies } from "next/headers";

const client = new Client();
client.setEndpoint(envConfig.endpointUrl!).setProject(envConfig.projectId!);

export const createSessionClient = async () => {
  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) throw new Error("No session");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
