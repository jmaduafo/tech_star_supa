"use client";
import React, { useState, useEffect } from "react";
import Header3 from "@/components/fontsize/Header3";
import TextButton from "@/components/ui/buttons/TextButton";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { Amount, Chart, ChartData, Project } from "@/types/types";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Reset from "@/components/ui/buttons/Reset";
import { ChartConfig } from "@/components/ui/chart";
import LineChart from "../../ui/charts/LineChart";
import NotAvailable from "@/components/ui/NotAvailable";
import { currency_list } from "@/utils/dataTools";
import Header6 from "@/components/fontsize/Header6";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { getUniqueObjects } from "@/utils/chartHelpers";
import LineChart2 from "@/components/ui/charts/LineChart2";

function LineChartDisplay() {
  const [filteredData, setFilteredData] = useState<ChartData[] | undefined>();
  const [projectData, setProjectData] = useState<Project[] | undefined>();
  const [currencyList, setCurrencyList] = useState<Amount[] | undefined>();
  const [paymentData, setPaymentData] = useState<ChartData[] | undefined>();

  const [projectId, setProjectId] = useState("");
  const [range, setRange] = useState("last 1 year");
  const [currencyCode, setCurrencyCode] = useState("");

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    try {
      if (!userData) {
        return;
      }

      const [projects, currencies] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name")
          .eq("team_id", userData.team_id)
          .order("created_at", { ascending: true })
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select(
            "id, name, amount, code, symbol, payments ( id, date, team_id )"
          )
          .eq("payments.team_id", userData.team_id)
          .throwOnError(),
      ]);

      setProjectData(projects.data as Project[]);
      setProjectId(projects.data[0].id);

      const chart: ChartData[] = [];

      currencies.data.forEach((item) => {
        const payment = Array.isArray(item.payments)
          ? item.payments[0]
          : item.payments;

        chart.push({ name: payment.date, value: item.amount });
      });

      setPaymentData(
        chart.toSorted((a, b) => {
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);
          return dateA.getTime() - dateB.getTime(); // Descending order
        })
      );

      setFilteredData(
        chart.toSorted((a, b) => {
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);
          return dateA.getTime() - dateB.getTime(); // Descending order
        })
      );

      setCurrencyList(
        getUniqueObjects(currencies.data, "code") as unknown as Amount[]
      );
      setCurrencyCode(getUniqueObjects(currencies.data, "code")[0].code);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filterPayments = () => {};

  return (
    <div className="h-full">
      {filteredData ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      {/* "flex gap-10 justify-between items-start" */}
      <div className="">
        <Header3 text="At a Glance" />
        <Header6
          className="opacity-80"
          text={`All payments made within the ${range.length ? range : "..."}`}
        />
      </div>
      <div className="">
        <div className="grid grid-cols-2 md:flex md:justify-between gap-2 mt-2 md:max-w-[65%]">
          <SelectBar
            valueChange={setProjectId}
            className=""
            value={projectId}
            placeholder="Select a project"
            label="Project"
          >
            {projectData?.length
              ? projectData?.map((item) => {
                  return (
                    <SelectItem value={item.id} key={item.id}>
                      {item.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectBar>
          <SelectBar
            valueChange={setRange}
            className=""
            value={range}
            placeholder="Select a range"
            label="Project"
          >
            {["Last week", "Last 1 month", "Last 1 year"].map((item) => {
              return (
                <SelectItem value={item.toLowerCase()} key={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <SelectBar
            valueChange={setCurrencyCode}
            className=""
            value={currencyCode}
            placeholder="Select a currency"
            label="Currency"
          >
            {currencyList
              ? currencyList.map((item) => {
                  return (
                    <SelectItem value={item.code} key={item.id}>
                      {item.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectBar>
          <div className="flex gap-1.5">
            <CheckedButton
              clickedFn={filterPayments}
              disabledLogic={
                !projectId.length || !range.length || !currencyCode.length
              }
            />
          </div>
        </div>
      </div>
      <div className="h-[40vh] w-full">
        {filteredData?.length ? (
          <div className="mt-8 w-full h-full">
            <LineChart2 data={filteredData} />
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <NotAvailable text="No payments available for visual data" />
          </div>
        )}
      </div>
    </div>
  );
}

export default LineChartDisplay;
