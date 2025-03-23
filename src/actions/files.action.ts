"use server";

import { createAdminClient } from "@/appwrite";
import { getCurrentUser } from ".";
import { envConfig } from "@/config";
import { ID, Query } from "node-appwrite";
import { getFileType } from "@/components/ui/getFileType";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type GetFileArgs = {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
};

type FileUploadProps = {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
};

export const getFiles = async ({ types = [], searchText = "", sort = "$createdAt-desc", limit }: GetFileArgs) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const [sortBy, order] = sort.split("-");
    const queries = [
      Query.or([Query.equal("owner", [currentUser.$id]), Query.contains("users", [currentUser.email])]),
      ...(types.length ? [Query.equal("type", types)] : []),
      ...(searchText ? [Query.contains("name", searchText)] : []),
      ...(limit ? [Query.limit(limit)] : []),
      ...(order === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)),
    ];

    const files = await databases.listDocuments(envConfig.databaseId!, envConfig.filesCollectionId!, queries);

    return files;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async ({ file, ownerId, accountId, path }: FileUploadProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(envConfig.bucketId!, ID.unique(), inputFile);

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: String(bucketFile.sizeOriginal),
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    console.log(fileDocument, "here is file documetn");

    const newFile = await databases
      .createDocument(envConfig.databaseId!, envConfig.filesCollectionId!, ID.unique(), fileDocument)
      .catch(async (err) => {
        console.log(JSON.stringify(err));
        await storage.deleteFile(envConfig.bucketId!, bucketFile.$id);
        throw new Error("Failed to create file document");
      });

    revalidatePath(path);
    return newFile;
  } catch (err) {
    console.log(err, "file upload error");
  }
};
