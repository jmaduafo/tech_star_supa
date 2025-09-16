import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import React from "react";
import TextButton from "../buttons/TextButton";
import Loading from "../loading/Loading";

function CountCard({
  count,
  showLink,
}: {
  readonly count: number | undefined;
  readonly showLink?: boolean;
}) {
  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          {count > 0 && showLink ? (
            <div className="flex justify-end">
              <TextButton
                href="/projects"
                text="View all"
                iconDirection="right"
              />
            </div>
          ) : null}
          <div className="mt-auto">
            <p className="text-center font-semibold text-[4vw] leading-[1] mt-3">
              {count}
            </p>
            <Header6
              text={`Total project${optionalS(count)}`}
              className="text-center mt-3"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </>
  );
}

export default CountCard;
