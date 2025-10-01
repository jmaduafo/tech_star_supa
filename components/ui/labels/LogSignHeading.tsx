import Header4 from "@/components/fontsize/Header4";
import Paragraph from "@/components/fontsize/Paragraph";
import React from "react";

function LogSignHeading({
  heading,
  text,
}: {
  readonly heading: string;
  readonly text: string;
}) {
  return (
    <>
      <Header4 text={heading} className="text-darkText" />
      <Paragraph className="mt-2 text-darkText/70" text={text} />
    </>
  );
}

export default LogSignHeading;
