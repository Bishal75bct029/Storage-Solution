"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { getFiles } from "@/actions/files.action";
import Thumbnail from "./Thumbnail";
import { Input } from "./ui/input";
import { formatDateTime } from "./ui/formatDateTime";
import { cn } from "@/lib/utils";
import { customToast } from "./ui/sonner";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayFetch = setTimeout(async () => {
      setResults([]);
      setOpen(false);
      router.push(path.replace(searchParams.toString(), ""));

      const files = await getFiles({ types: [], searchText: query });
      if ("error" in files) return customToast(files.error, "error");

      setResults(files.documents);
      setOpen(true);
    }, 500);

    return () => clearTimeout(delayFetch);
  }, [query, path, router, searchParams]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    setQuery("");

    router.push(`/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`);
  };
  return (
    <div className="relative w-full md:max-w-[30rem]">
      <div className="shadow-drop-3 flex h-[3.25rem] flex-1 items-center gap-3 rounded-full px-4">
        <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} />
        <Input
          value={query}
          placeholder="Search..."
          className="body2 shad-no-focus placeholder:body1 placeholder:text-light-grey w-full border-none p-0 shadow-none"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="absolute top-16 left-0 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4">
            {results.length > 0 ? (
              results.map((file) => (
                <li className="flex items-center justify-between" key={file.$id} onClick={() => handleClickItem(file)}>
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail type={file.type} extension={file.extension} url={file.url} className="size-9 min-w-9" />
                    <p className="subtitle2 text-dark-grey line-clamp-1">{file.name}</p>
                  </div>

                  <p className={cn("body1 caption text-light-grey line-clamp-1")}>{formatDateTime(file.$createdAt)}</p>
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
