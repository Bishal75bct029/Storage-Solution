import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "shad-no-focus placeholder:subtitle body2 border-none p-0 shadow-none ring-offset-transparent outline-none focus:ring-transparent focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
