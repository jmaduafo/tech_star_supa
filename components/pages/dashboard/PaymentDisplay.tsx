import React from "react";
import Header3 from "@/components/fontsize/Header3";
// import {
//   collection,
//   limit,
//   orderBy,
//   where,
//   query,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "@/firebase/config";
import { optionalS } from "@/utils/optionalS";
import TextButton from "@/components/ui/buttons/TextButton";
import { Payment } from "@/types/types";
// import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
// import DataTable from "@/components/ui/tables/DataTable";
import Header6 from "@/components/fontsize/Header6";
import { paymentColumns } from "@/components/ui/tables/columns";
import MainTable from "@/components/ui/tables/MainTable";

function PaymentDisplay() {
  // const { userData } = useAuth();

  // async function getLatest() {
  //   try {
  //     if (!userData) {
  //       return;
  //     }
  //     const q = query(
  //       collection(db, "payments"),
  //       orderBy("date", "desc"),
  //       where("team_id", "==", userData?.team_id),
  //       limit(5)
  //     );

  //     const latestDocs = await getDocs(q);

  //     const payments: Payment[] = [];

  //     latestDocs.forEach((doc) => {
  //       payments.push({ ...(doc.data() as Payment), id: doc.id });
  //     });

  //     setLatestPayments(payments);
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // }

  // useEffect(() => {
  //   getLatest();
  // }, [userData?.id ?? "guest"]);

  return (
    <section className="w-full py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-5">
          {/* LATEST HEADING WITH PAYMENTS COUNT */}
          <Header3 text="Latest Payments" />
          {/* {latestPayments ? (
            <Header6
              text={
                latestPayments.length === 5
                  ? "Max. 5 results"
                  : `${latestPayments.length} result${optionalS(
                      latestPayments.length
                    )}`
              }
            />
          ) : null} */}
        </div>
        {/* PAYMENTS  */}
        <div>
          {/* {latestPayments?.length ? (
            <TextButton
              href="/payments"
              text="View all"
              iconDirection="right"
            />
          ) : null} */}
        </div>
      </div>
      <div className="mt-6">
        <MainTable columns={[]} data={[]} is_payment={false} team_name={""} />
      </div>
      {/* <div className="mt-6">
        {!latestPayments ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : (
          <DataTable
            columns={paymentColumns}
            data={latestPayments}
            is_payment
            team_name={"My"}
          />
        )}
      </div> */}
    </section>
  );
}

export default PaymentDisplay;
