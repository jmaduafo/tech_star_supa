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
import { switchPeriod } from "@/utils/dateAndTime";
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
  project_id,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
  readonly project_id: string;
}) {
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  const [allContracts, setAllContracts] = useState<Contract[] | undefined>();
  const [allContractors, setAllContractors] = useState<
    Contractor[] | undefined
  >();

  const [paymentData, setPaymentData] = useState<any[] | undefined>();
  const [contractData, setContractData] = useState<any[] | undefined>();

  const [selectedData, setSelectedData] = useState("Payments");

  const supabase = createClient();

  const getData = async () => {
    if (!user || !project_id.length) {
      return;
    }

    const [contractors, payments, contracts] = await Promise.all([
      supabase
        .from("contractors")
        .select("id, project_id, name")
        .eq("team_id", user.team_id)
        .throwOnError(),
      supabase
        .from("payments")
        .select("id, project_id, date, contractor_id, is_paid, is_completed")
        .eq("team_id", user.team_id)
        .throwOnError(),
      supabase
        .from("contracts")
        .select("id, project_id, date, contractor_id, is_completed")
        .eq("team_id", user.team_id)
        .throwOnError(),
    ]);

    setAllContractors(contractors.data as unknown as Contractor[]);
    setAllContracts(contracts.data as unknown as Contract[]);
    setAllPayments(payments.data);

    const paymentChart = paymentStatusBarChart(
      project_id,
      payments.data as Payment[],
      contractors.data as Contractor[],
      timePeriod
    );
    const contractChart = contractStatusBarChart(
      project_id,
      contracts.data as Contract[],
      contractors.data as Contractor[],
      timePeriod
    );

    setPaymentData(paymentChart);
    setContractData(contractChart);
  };

  useEffect(() => {
    getData();
  }, [project_id, user]);

  useEffect(() => {
    if (allContracts && allContractors) {
      const contractChart = contractStatusBarChart(
        project_id,
        allContracts,
        allContractors,
        switchPeriod(timePeriod)
      );

      setContractData(contractChart);
    }

    if (allPayments && allContractors) {
      const paymentChart = paymentStatusBarChart(
        project_id,
        allPayments,
        allContractors,
        switchPeriod(timePeriod)
      );

      setPaymentData(paymentChart);
    }
  }, [timePeriod, project_id]);

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
