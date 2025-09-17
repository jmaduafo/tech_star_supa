"use client";

import PieChart2 from "@/components/ui/charts/PieChart2";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import {
  Amount,
  Contract,
  Contractor,
  Payment,
  Project,
  Stage,
  User,
} from "@/types/types";
import {
  paymentPieContractChart,
  paymentPieContractorChart,
  paymentPieCurrencyChart,
  paymentPieStageChart,
} from "@/utils/chartHelpers";
import { SelectItem } from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { PieChart } from "recharts";

function PaymentPie({
  timePeriod,
  user,
  project_id,
  projects,
  currencies,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly user: User | undefined;
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  const [value, setValue] = useState("Currency");

  const [currencyData, setCurrencyData] = useState<any[] | undefined>();
  const [contractData, setContractData] = useState<any[] | undefined>();
  const [contractorData, setContractorData] = useState<any[] | undefined>();
  const [stageData, setStageData] = useState<any[] | undefined>();

  const getData = async () => {
    if (!project_id || !projects) {
      return;
    }

    const project = projects.find((item) => item.id === project_id);

    if (!project || !project.payments) {
      return;
    }

    const currency: Amount[] = [];

    project.payments.forEach((item) => {
      const amount = Array.isArray(item.payment_amounts)
        ? item.payment_amounts[0]
        : item.payment_amounts;

      currency.push(amount as Amount);
    });

    const contracts = project.contracts;
    const payments = project.payments;
    const contractors = project.contractors;
    const stages = project.stages;

    const currencyChart = paymentPieCurrencyChart(
      project_id,
      currency,
      payments as Payment[]
    );
    const contractChart = paymentPieContractChart(
      project_id,
      contracts as Contract[],
      payments as Payment[]
    );
    const contractorChart = paymentPieContractorChart(
      project_id,
      contractors as Contractor[],
      payments as Payment[]
    );
    const stageChart = paymentPieStageChart(
      project_id,
      stages as Stage[],
      payments as Payment[]
    );

    setContractData(contractChart);
    setContractorData(contractorChart);
    setCurrencyData(currencyChart);
    setStageData(stageChart);
  };

  useEffect(() => {
    getData();
  }, [project_id]);

  useEffect(() => {
    getData();
  }, [value]);

  const switchCharts = () => {
    if (!currencyData || !stageData || !contractorData || !contractData) {
      return;
    }

    if (value === "Currency") {
      return currencyData;
    } else if (value === "Stages") {
      return stageData;
    } else if (value === "Contractors") {
      return contractorData;
    } else if (value === "Contracts") {
      return contractData;
    }
  };

  return (
    <div className="h-full">
      {!currencyData || !contractData || !contractorData || !stageData ? (
        <div className="h-full flex justify-center item-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <SelectBar
            placeholder={"Select a category"}
            label={"Categories"}
            value={value}
            valueChange={setValue}
            className="w-full"
          >
            {["Currency", "Stages", "Contractors", "Contracts"].map((item) => {
              return (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <div className="h-[35vh] w-full mt-auto">
            <PieChart2 data={switchCharts() ?? []} dataKey="paymentCount" />
          </div>
          <div className="mt-auto">
            <p>Hsis</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPie;
