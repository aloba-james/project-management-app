import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
  className?: string;
};

const Header = ({
  name,
  buttonComponent,
  isSmallText = false,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "mb-5 flex w-full items-center justify-between gap-3",
        className,
      )}
    >
      <h1
        className={cn(
          "font-semibold tracking-tight text-foreground",
          isSmallText ? "text-lg" : "text-2xl",
        )}
      >
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;
