"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FridgeChefLogoProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const FridgeChefLogo = React.forwardRef<
  HTMLHeadingElement,
  FridgeChefLogoProps
>(({ className, ...props }, ref) => {
  return (
    <h1 ref={ref} className={cn("flex items-center space-x-2", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M4.5 5.653c0-1.426 1.517-2.532 2.993-2.532H16.507c1.476 0 2.993 1.105 2.993 2.532V18.347c0 1.426-1.517 2.532-2.993 2.532H7.493c-1.476 0-2.993-1.105-2.993-2.532V5.653zM9 14.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm5.25-3a.75.75 0 01.75.75V12h-6v-.99a.75.75 0 01.75-.75h4.5z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-white text-3xl font-bold">FridgeChef</span>
    </h1>
  );
});
FridgeChefLogo.displayName = "FridgeChefLogo";
