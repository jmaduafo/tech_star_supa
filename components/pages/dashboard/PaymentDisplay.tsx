"use client";
import React, { useEffect, useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import { optionalS } from "@/utils/optionalS";
import TextButton from "@/components/ui/buttons/TextButton";
import { Payment } from "@/types/types";
import Loading from "@/components/ui/loading/Loading";
import Header6 from "@/components/fontsize/Header6";
import { paymentColumns } from "@/components/ui/tables/columns";
import MainTable from "@/components/ui/tables/MainTable";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

function PaymentDisplay() {
  const [data, setData] = useState<Payment[] | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  const getLatest = async () => {
    try {
      if (!userData) {
        return;
      }

      const { data } = await supabase
        .from("payments")
        .select(
          "*, contracts (contract_code), projects (name), contractors (name), stages ( id, name), payment_amounts (*)"
        )
        .eq("team_id", userData.team_id)
        .order("date", { ascending: false })
        .limit(5)
        .throwOnError();

      setData(data as Payment[]);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getLatest();
  }, []);

  return (
    <section className="w-full py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-5">
          {/* LATEST HEADING WITH PAYMENTS COUNT */}
          <Header3 text="Latest Payments" />
          {data ? (
            <Header6
              text={
                data.length === 5
                  ? "Max. 5 results"
                  : `${data.length} result${optionalS(data.length)}`
              }
            />
          ) : null}
        </div>
        {/* PAYMENTS  */}
        <div>
          {data?.length ? (
            <TextButton
              href="/payments"
              text="View all"
              iconDirection="right"
            />
          ) : null}
        </div>
      </div>
      <div className="mt-6"></div>
      <div className="mt-6">
        {!data ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : (
          <MainTable
            columns={paymentColumns}
            data={data}
            is_payment
            team_name={"My"}
            filterCategory="description"
          />
        )}
      </div>
    </section>
  );
}

export default PaymentDisplay;
