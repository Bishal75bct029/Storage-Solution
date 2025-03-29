"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ToasterProps } from "sonner";
import { AlertTriangle, CheckCircle } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="bg-red-500 text-2xl"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export const customToast = (message: string, type: "success" | "error") => {
  toast[type](message, {
    icon:
      type === "success" ? (
        <CheckCircle className="h-6 w-6 text-green-500" />
      ) : (
        <AlertTriangle className="h-6 w-6 text-red-500" />
      ),
    className: "flex items-center space-x-4 p-4", // Proper spacing
    descriptionClassName: "text-lg ml-8", // Moves text away from the icon
  });
};

export { Toaster };
