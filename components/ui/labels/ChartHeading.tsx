import Header4 from "@/components/fontsize/Header4";
import Header6 from "@/components/fontsize/Header6";
import React from "react";

function ChartHeading({
  text,
  subtext,
  className,
}: {
  readonly text: string;
  readonly subtext: string;
  readonly className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <Header4 text={text} />
      <Header6 text={subtext} className="text-darkText/70 mt-0.5" />
    </div>
  );
}

export default ChartHeading;
