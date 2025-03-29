import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import { cn, convertFileSize, getUsageSummary } from "@/lib/utils";
import { Chart } from "./components/Chart";
import { getFiles, getTotalSpaceUsed } from "@/actions/files.action";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/components/ui/formatDateTime";
import ActionDropdown from "@/components/ActionDropDown";
import { customToast } from "@/components/ui/sonner";

const Home = async () => {
  const [files, totalSpace] = await Promise.all([getFiles({ types: [], limit: 10 }), getTotalSpaceUsed()]);
  if ("error" in files) return customToast(files.error, "error");

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="bg-dark-white mr-6 rounded-4xl">
      <div className="justify-items-between mx-auto grid grid-cols-1 rounded-4xl p-6 md:grid-cols-2 xl:gap-12">
        <section>
          <Chart used={totalSpace?.used ?? 0} />

          <ul className="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
            {usageSummary.map((summary) => (
              <Link
                href={summary.url}
                key={summary.title}
                className="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="flex justify-between gap-3">
                    <Image
                      src={summary.icon}
                      width={100}
                      height={100}
                      alt="uploaded image"
                      className="absolute top-[-25px] -left-3 z-10 w-[190px] object-contain"
                    />
                    <h4 className="h4 relative z-20 w-full text-right">{convertFileSize(summary.size) || 0}</h4>
                  </div>
                  <h5 className="h5 relative z-20 text-center">{summary.title}</h5>
                  <Separator className="bg-dark-white" />
                  <p className={cn("body1 text-light-grey text-center")}>{formatDateTime(summary.latestDate)}</p>
                </div>
              </Link>
            ))}
          </ul>
        </section>

        {/* Recent files uploaded */}
        <section className="ml-auto h-full w-full max-w-[35rem] rounded-[20px] bg-white p-5 xl:mr-16 xl:p-8">
          <h2 className="h2 xl:h2 text-dark-grey">Recent files uploaded</h2>
          {!!files.documents.length ? (
            <ul className="mt-5 flex flex-col gap-5">
              {files.documents.slice(0, 9).map((file: Models.Document) => (
                <Link href={file.url} target="_blank" className="flex items-center gap-3" key={file.$id}>
                  <Thumbnail type={file.type} extension={file.extension} url={file.url} />

                  <div className="flex w-full flex-col xl:flex-row xl:justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="subtitle2 text-dark-grey line-clamp-1 w-full sm:max-w-[200px] lg:max-w-[250px]">
                        {file.name}
                      </p>
                      <p className={cn("body2 text-light-grey")}>{formatDateTime(file.$createdAt)}</p>
                    </div>
                    <ActionDropdown file={file} />
                  </div>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="body1 text-dark-grey mt-10 text-center">No files uploaded</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
