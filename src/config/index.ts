export const envConfig = {
  secretKey: process.env.NEXT_APPWRITE_SECRET_KEY,
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
  usersCollectionId: process.env.NEXT_PUBLIC_COLLECTION_USERS,
  filesCollectionId: process.env.NEXT_PUBLIC_COLLECTION_FILES,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
};
