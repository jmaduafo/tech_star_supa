import React from "react";
import { Skeleton } from "../skeleton";

function CardSkeleton({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <Skeleton
      className={`px-8 py-6 rounded-[40px] bg-light15 backdrop-blur-[100px] flex justify-center items-center ${className}`}
    >
      {children}
    </Skeleton>
  );
}

export default CardSkeleton;
