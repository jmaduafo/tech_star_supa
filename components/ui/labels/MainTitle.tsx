import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import React from "react";

function MainTitle({
  title,
  data,
}: {
  readonly title: string;
  readonly data: any[] | undefined;
}) {
  return (
    <div className="flex items-start gap-5 mb-4">
      {title.length ? <Header1 text={title} /> : null}
      {data ? (
        <Header6 text={`${data.length} result${optionalS(data.length)}`} />
      ) : null}
    </div>
  );
}

export default MainTitle;
