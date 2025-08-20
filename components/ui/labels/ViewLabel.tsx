import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import React from "react";

function ViewLabel({
  className,
  label,
  content,
  children,
  custom,
}: {
  readonly className?: string;
  readonly label: string;
  readonly content?: string;
  readonly children?: React.ReactNode;
  readonly custom?: boolean;
}) {
  const contentDisplay =
    content ? (
      <Paragraph text={content} />
    ) : (
      <Paragraph text={"N/A"} />
    );

  return (
    <div className={className}>
      <Header6 text={label} className="capitalize text-darkText font-medium" />
      <div className="mt-1 text-darkText/75 text-[14.5px]">
        {!custom ? contentDisplay : children}
      </div>
    </div>
  );
}

export default ViewLabel;
