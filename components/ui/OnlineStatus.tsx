import React from "react";

function OnlineStatus({ status }: { readonly status: "online" | "offline" }) {
  return status === "online" ? (
    <p className="text-[14px] py-1 px-4 rounded-full border border-green-200 bg-[#bbf7d030] w-fit text-green-200">
      Online <span className="animate-ping ml-1">&#9679;</span>{" "}
    </p>
  ) : (
    <p className="text-[14px] py-1 px-4 rounded-full border border-red-500 bg-[#ef444430] w-fit text-red-500">
      Offline <span className="animate-ping ml-1">&#9679;</span>{" "}
    </p>
  );
}

export default OnlineStatus;
