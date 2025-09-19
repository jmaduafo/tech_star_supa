"use client";

import BarChart from "@/components/ui/charts/BarChart";
import SelectBar from "@/components/ui/input/SelectBar";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { SelectItem } from "@/components/ui/select";
import { Contract, Contractor, Payment, Project, User } from "@/types/types";
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
  projects,
  currency_code,
}: {
  readonly timePeriod: string;
  readonly currency_code: string;
  readonly user: User | undefined;
  readonly project_id: string;
  readonly projects: Project[] | undefined;
}) {
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  const [allContracts, setAllContracts] = useState<Contract[] | undefined>();
  const [allContractors, setAllContractors] = useState<
    Contractor[] | undefined
  >();

  const [paymentData, setPaymentData] = useState<Status[] | undefined>();
  const [contractData, setContractData] = useState<Status[] | undefined>();

  const [selectedData, setSelectedData] = useState("Payments");
  const [selectedType, setSelectedType] = useState("Count");

  const getData = async () => {
    if (!user || !project_id.length || !projects) {
      return;
    }

    const project = projects.find((item) => item.id === project_id);

    if (!project) {
      return;
    }

    const contractors = project.contractors;
    const contracts = project.contracts;
    const payments = project.payments;

    setAllContractors(contractors);
    setAllContracts(contracts);
    setAllPayments(payments);

    const paymentChart = paymentStatusBarChart(
      project_id,
      payments as Payment[],
      contractors as Contractor[],
      switchPeriod(timePeriod),
      currency_code,
      selectedType === "Count" ? true : false
    );
    const contractChart = contractStatusBarChart(
      project_id,
      contracts as Contract[],
      contractors as Contractor[],
      switchPeriod(timePeriod),
      currency_code,
      selectedType === "Count" ? true : false
    );

    setPaymentData(paymentChart);
    setContractData(contractChart);
  };

  useEffect(() => {
    getData();
  }, [project_id, user, projects]);

  useEffect(() => {
    if (allContracts && allContractors) {
      const contractChart = contractStatusBarChart(
        project_id,
        allContracts,
        allContractors,
        switchPeriod(timePeriod),
        currency_code,
        selectedType === "Count" ? true : false
      );

      setContractData(contractChart);
    }

    if (allPayments && allContractors) {
      const paymentChart = paymentStatusBarChart(
        project_id,
        allPayments,
        allContractors,
        switchPeriod(timePeriod),
        currency_code,
        selectedType === "Count" ? true : false
      );

      setPaymentData(paymentChart);
    }
  }, [timePeriod, project_id, selectedType, currency_code]);

  return (
    <div className="h-full w-full">
      {!paymentData && !contractData ? (
        <div className="flex justify-center items-center min-h-64">
          <Loading />
        </div>
      ) : (
        <div className="">
          <ChartHeading
            text="Status Chart"
            subtext={
              timePeriod !== "All Time"
                ? `All ${
                    selectedType === "Count" ? "counted" : "aggregated"
                  } ${selectedData.toLowerCase()} per contractor within the past ${switchPeriod(
                    timePeriod
                  )} by status`
                : `All ${
                    selectedType === "Count" ? "counted" : "aggregated"
                  } ${selectedData.toLowerCase()} per contractor by status`
            }
          />
          <div className="flex items-center gap-2">
            <SelectBar
              placeholder={"Select a chart"}
              label={"Charts"}
              value={selectedData}
              valueChange={setSelectedData}
              className="mb-6 max-w-[15rem]"
            >
              {["Payments", "Contracts"].map((item) => {
                return (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectBar>
            <SelectBar
              placeholder={"Select a type"}
              label={"Type"}
              value={selectedType}
              valueChange={setSelectedType}
              className="mb-6 max-w-[15rem]"
            >
              {["Count", "Value"].map((item) => {
                return (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectBar>
          </div>
          <div className="h-[40vh] w-full">
            {selectedData === "Payments" ? (
              <BarChart
                data={paymentData as any[]}
                dataArray={["paid", "pending", "unpaid"]}
                format={selectedType !== "Count"}
                code={currency_code}
              />
            ) : (
              <BarChart
                data={contractData as any[]}
                dataArray={["completed", "ongoing"]}
                format={selectedType !== "Count"}
                code={currency_code}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusBar;
