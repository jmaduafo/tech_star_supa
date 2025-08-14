import React from "react";

function Paragraph({
  text,
  className,
}: {
  readonly text: string;
  readonly className?: string;
}) {
  return <p className={`${className} text-[14px]`}>{text}</p>;
}

export default Paragraph;
