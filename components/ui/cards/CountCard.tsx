import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import React from "react";
import TextButton from "../buttons/TextButton";
import Loading from "../loading/Loading";
import Paragraph from "@/components/fontsize/Paragraph";

function CountCard({
  count,
  showLink,
  title,
  link
}: {
  readonly count: number | undefined;
  readonly showLink?: boolean;
  readonly title: string;
  readonly link?: string
}) {
  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          {count > 0 && showLink ? (
            <div className="flex justify-end">
              <TextButton
                href={link}
                text="View all"
                iconDirection="right"
              />
            </div>
          ) : null}
          <div className="mt-auto">
            <p className="text-center font-semibold text-[4vw] leading-[1] mt-2">
              {count}
            </p>
            <Paragraph
              text={`${title}${optionalS(count)}`}
              className="text-center mt-3"
            />
          </div>
        </div>
      ) : (
        <div className="min-h-16 flex justify-center items-center">
          <Loading />
        </div>
      )}
    </>
  );
}

export default CountCard;
