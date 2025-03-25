"use server";

import { createAdminClient, createSessionClient } from "@/appwrite";
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

type RenameFileProps = {
  fileId: string;
  name: string;
  extension: string;
  path: string;
};

type DeleteFileProps = {
  fileId: string;
  bucketFileId: string;
  path: string;
};

type UpdateFileUsersProps = {
  isNewShare: boolean;
  fileId: string;
  emails: string[];
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
      // ...(order === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)),
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

    const newFile = await databases
      .createDocument(envConfig.databaseId!, envConfig.filesCollectionId!, ID.unique(), fileDocument)
      .catch(async (err) => {
        await storage.deleteFile(envConfig.bucketId!, bucketFile.$id);
        throw new Error("Failed to create file document");
      });

    revalidatePath(path);
    return newFile;
  } catch (err) {
    console.log(err, "file upload error");
  }
};

export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(envConfig.databaseId!, envConfig.filesCollectionId!, fileId, {
      name: newName,
    });

    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    console.log(error, "Failed to rename file");
  }
};

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(envConfig.databaseId!, envConfig.filesCollectionId!, fileId);

    if (deletedFile) {
      await storage.deleteFile(envConfig.bucketId!, bucketFileId);
    }

    revalidatePath(path);
    return { status: "success" };
  } catch (error) {
    console.log(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({ fileId, emails, path, isNewShare = false }: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  console.log(emails, "here are emails");

  try {
    if (isNewShare) {
      const document = await databases.getDocument(envConfig.databaseId!, envConfig.filesCollectionId!, fileId);
      const updatedFile = await databases.updateDocument(envConfig.databaseId!, envConfig.filesCollectionId!, fileId, {
        users: [...document.users, ...emails],
      });

      revalidatePath(path);
      return updatedFile;
    }

    const updatedFile = await databases.updateDocument(envConfig.databaseId!, envConfig.filesCollectionId!, fileId, {
      users: emails,
    });

    console.log(emails, "remaining emails");

    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    console.log(error, "Failed to rename file");
  }
};

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(envConfig.databaseId!, envConfig.filesCollectionId!, [
      Query.equal("owner", [currentUser.$id]),
    ]);

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += Number(file.size);
      totalSpace.used += Number(file.size);

      if (!totalSpace[fileType].latestDate || new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return totalSpace;
  } catch (error) {
    console.log(error, "Error calculating total space used:, ");
  }
}
