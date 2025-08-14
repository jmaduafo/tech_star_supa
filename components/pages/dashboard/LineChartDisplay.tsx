"use client";
import React, { useState, useEffect } from "react";
import Header3 from "@/components/fontsize/Header3";
import Paragraph from "@/components/fontsize/Paragraph";
import TextButton from "@/components/ui/buttons/TextButton";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { Chart, Project, User } from "@/types/types";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Reset from "@/components/ui/buttons/Reset";
// import { db } from "@/firebase/config";
// import { query, collection, where, orderBy } from "firebase/firestore";
// import { getQueriedItems } from "@/firebase/actions";
// import { filterByDateRange, formatChartDate } from "@/utils/dateAndTime";
import { ChartConfig } from "@/components/ui/chart";
import LineChart from "../../ui/charts/LineChart";
import NotAvailable from "@/components/ui/NotAvailable";
import { currency_list } from "@/utils/dataTools";

function LineChartDisplay({ user }: { readonly user: User | undefined }) {
  const [chartData, setChartData] = useState<Chart[] | undefined>();
  const [filteredData, setFilteredData] = useState<Chart[] | undefined>();
  const [projectData, setProjectData] = useState<Project[] | undefined>();

  const [projectId, setProjectId] = useState("");
  const [range, setRange] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");

  let chartConfig = {
    amount: {
      label: currency_list.find((i) => i.code === currencyCode)?.symbol,
    },
  } satisfies ChartConfig;

  // async function getProjects() {
  //   try {
  //     if (!user) {
  //       return;
  //     }

  //     const projectq = query(
  //       collection(db, "projects"),
  //       where("team_id", "==", user?.team_id)
  //     );

  //     const allProjects = await getQueriedItems(projectq);

  //     setProjectData(allProjects as Project[]);
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // }

  // async function getPayments() {
  //   try {
  //     if (!user) {
  //       return;
  //     }

  //     const paymentq = query(
  //       collection(db, "payments"),
  //       where("team_id", "==", user?.team_id),
  //       orderBy("date", "asc")
  //     );

  //     const allPayments = await getQueriedItems(paymentq);

  //     const arr: Chart[] = [];
  //     allPayments.forEach((doc) => {
  //       arr.push({
  //         id: doc?.id,
  //         project_id: doc?.project_id,
  //         date: formatChartDate(doc?.date),
  //         amount: doc?.currency_amount,
  //         currency_code: doc?.currency_code,
  //       });
  //     });

  //     setChartData(arr);
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // }

  // // ON FILTER CLICK, FILTER PAYMENTS BY THE APPROPRIATE DATE RANGE AND PROJECT ID
  // function filterPayments() {
  //   // FILTER ORIGINAL DATA WHERE THE PROJECT ID AND PROJECT CURRENCY CODE IS EQUAL TO
  //   // THE SELECTED PROJECT ID AND CURRENCY CODE TO GET
  //   // AN ARRAY OF PAYMENTS MADE FOR THE SELECTED PROJECT
  //   const payments = chartData?.filter(
  //     (item) =>
  //       item?.project_id === projectId && item?.currency_code === currencyCode
  //   );

  //   if (!payments?.length) {
  //     setFilteredData([]);
  //   }    

  //   // IF THERE ARE PROJECTS FOUND, ADD THE ARRAY WITHIN THE SELECTED DATE RANGE
  //   // TO THE NEW FILTER ARRAY
  //   setFilteredData(
  //     filterByDateRange(payments, range)
  //   );
  // }

  // useEffect(() => {
  //   getProjects();
  //   getPayments();
  // }, [user?.id ?? "guest"]);

  function reset() {
    setProjectId("");
    setRange("");
    setCurrencyCode("");
  }

  return (
    <div className="h-full">
      {chartData ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      <div className="flex gap-10 justify-between items-start">
        <div className="flex-1">
          <Header3 text="At a Glance" />
          <Paragraph
            className="opacity-80"
            text={`All payments made within the ${
              range.length ? range : "..."
            }`}
          />
        </div>
        <div className="flex-[2]">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-2 mt-2">
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
                {["Last 7 days", "Last 1 month", "Last 3 months"].map(
                  (item) => {
                    return (
                      <SelectItem value={item.toLowerCase()} key={item}>
                        {item}
                      </SelectItem>
                    );
                  }
                )}
              </SelectBar>
              <SelectBar
                valueChange={setCurrencyCode}
                className=""
                value={currencyCode}
                placeholder="Select a currency"
                label="Currency"
              >
                {currency_list.map((item) => {
                  return (
                    <SelectItem value={item.code} key={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              <div className="flex gap-1.5">
                {/* <CheckedButton
                  clickedFn={filterPayments}
                  disabledLogic={
                    !projectId.length || !range.length || !currencyCode.length
                  }
                /> */}
                <Reset clickedFn={reset} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[80%] w-full">
        {filteredData?.length ? (
          <div className="mb-4">
            <LineChart chartConfig={chartConfig} chartData={filteredData} />
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
