"use client";

import BarChart from "@/components/ui/charts/BarChart";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import { SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Contract, Contractor, Payment, User } from "@/types/types";
import {
  paymentStatusBarChart,
  contractStatusBarChart,
} from "@/utils/chartHelpers";
import React, { useEffect, useState } from "react";

type Status = {
  name: string;
  pending: number;
  paid: number;
  unpaid: number;
};

function StatusBar({
  timePeriod,
  user,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
}) {
  const [paymentData, setPaymentData] = useState<any[] | undefined>();
  const [contractData, setContractData] = useState<any[] | undefined>();

  const [selectedData, setSelectedData] = useState("Payments");

  const supabase = createClient();

  const getData = async () => {
    if (!user) {
      return;
    }

    const [contractors, payments, contracts] = await Promise.all([
      supabase
        .from("contractors")
        .select("id, name")
        .eq("team_id", user.team_id)
        .throwOnError(),
      supabase
        .from("payments")
        .select("id, contractor_id, is_paid, is_completed")
        .eq("team_id", user.team_id)
        .throwOnError(),
      supabase
        .from("contracts")
        .select("id, contractor_id, is_completed")
        .eq("team_id", user.team_id)
        .throwOnError(),
    ]);

    const paymentChart = paymentStatusBarChart(
      payments.data as Payment[],
      contractors.data as Contractor[]
    );
    const contractChart = contractStatusBarChart(
      contracts.data as Contract[],
      contractors.data as Contractor[]
    );

    setPaymentData(paymentChart);
    setContractData(contractChart);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-full w-full">
      {!paymentData && !contractData ? (
        <div className="flex justify-center items-center min-h-64">
          <Loading />
        </div>
      ) : (
        <div className="">
          <SelectBar
            placeholder={"Select a chart"}
            label={"Charts"}
            value={selectedData}
            valueChange={setSelectedData}
            className="mb-6 w-[30%]"
          >
            {["Payments", "Contracts"].map((item) => {
              return (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <div className="h-[40vh] w-full">
            {selectedData === "Payments" ? (
              <BarChart
                data={paymentData as any[]}
                dataArray={[
                  { name: "paid", color: "#ececec" },
                  { name: "pending", color: "#d6d3d1" },
                  { name: "unpaid", color: "#a8a29e" },
                ]}
              />
            ) : (
              <BarChart
                data={contractData as any[]}
                dataArray={[
                  { name: "ongoing", color: "#ececec" },
                  { name: "completed", color: "#a8a29e" },
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusBar;
