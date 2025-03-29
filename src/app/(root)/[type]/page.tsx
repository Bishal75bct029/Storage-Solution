import React from "react";
import { Models } from "node-appwrite";
import { getFileTypesParams } from "@/lib/utils";
import { getFiles } from "@/actions/files.action";
import FileCard from "@/components/FileCard";
import Sort from "@/components/ui/Sort";
import { customToast } from "@/components/ui/sonner";

type SearchParamProps = {
  params?: Promise<{ type: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async (searchParamsProps: SearchParamProps) => {
  const { params, searchParams } = searchParamsProps;

  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  if ("error" in files) {
    return customToast(files.error, "error");
  }
  const size = files.documents.reduce((acc, file) => acc + (Number(file.size) || 0) / (1024 * 1024), 0).toFixed(2);

  return (
    <div className="lg:bg-light-white scrollbar mr-6 h-full max-h-[90%] overflow-y-scroll rounded-4xl bg-none p-6 pb-0">
      <div className="flex w-full max-w-7xl flex-col items-center gap-8">
        <section className="w-full">
          <h1 className="h1 capitalize">{type}</h1>

          <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-center">
            <p className="body1">
              Total: <span className="h5">{size} MB</span>
            </p>

            <div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
              <p className="body1 text-light-grey hidden whitespace-nowrap sm:block">Sort by:</p>

              <Sort />
            </div>
          </div>
        </section>

        {files.total ? (
          <section className="!grid !w-full !gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.documents.map((file: Models.Document) => (
              <FileCard key={file.$id} file={file} />
            ))}
          </section>
        ) : (
          <p className="body1 !text-light-grey mt-10 text-center">No files uploaded</p>
        )}
      </div>
    </div>
  );
};

export default Page;
