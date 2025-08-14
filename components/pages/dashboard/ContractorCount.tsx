"use client";
import React, { useState, useEffect } from "react";
import Header6 from "@/components/fontsize/Header6";
import Loading from "@/components/ui/Loading";
// import { db } from "@/firebase/config";
import { optionalS } from "@/utils/optionalS";
// import { query, collection, where } from "firebase/firestore";
// import { getQueriedCount } from "@/firebase/actions";
import { User } from "@/types/types";

function ContractorCount({ user }: { readonly user: User | undefined }) {
  const [count, setCount] = useState<number | undefined>();

  // async function getUser() {
  //   if (!user) {
  //     return;
  //   }

  //   const q = query(
  //     collection(db, "contractors"),
  //     where("team_id", "==", user?.team_id)
  //   );

  //   const contractorCount = await getQueriedCount(q);

  //   setCount(contractorCount);
  // }

  useEffect(() => {
    // getUser();
  }, [user?.id ?? "guest"]);

  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          <div className="mt-auto mb-3">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count}
            </p>
            <Header6
              text={`Total contractor${optionalS(count)}`}
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

export default ContractorCount;
