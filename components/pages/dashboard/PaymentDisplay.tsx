"use client";
import React, { useEffect, useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import { optionalS } from "@/utils/optionalS";
import TextButton from "@/components/ui/buttons/TextButton";
import { Amount, Payment, Project } from "@/types/types";
import Loading from "@/components/ui/loading/Loading";
import Header6 from "@/components/fontsize/Header6";
import { paymentColumns } from "@/components/ui/tables/columns";
import MainTable from "@/components/ui/tables/MainTable";
import { useAuth } from "@/context/UserContext";

function PaymentDisplay({
  projects,
  currencies,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  const [data, setData] = useState<Payment[] | undefined>();

  const { userData } = useAuth();

  const getLatest = async () => {
    try {
      if (!userData || !projects) {
        return;
      }

      const payments: Payment[] = [];

      projects.forEach((project) => {
        project.payments?.forEach((payment) => {
          payments.push(payment);
        });
      });

      // ORDER THE PAYMENTS IN DESCENDING ORDER
      const orderedPayment = payments.toSorted((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // ONLY GET 5 AT MOST
      setData(orderedPayment.slice(0, 5));
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getLatest();
  }, [projects]);

  return (
    <section className="w-full">
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
