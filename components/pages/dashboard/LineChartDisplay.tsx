"use client";
import React, { useState, useEffect } from "react";
import TextButton from "@/components/ui/buttons/TextButton";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { Amount, LineData, Project } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { useAuth } from "@/context/UserContext";
import { chartFormatTotal, getUniqueObjects } from "@/utils/chartHelpers";
import LineChart2 from "@/components/ui/charts/LineChart2";
import { dateRangeFilter, sortDate } from "@/utils/sortFilter";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import { checkArray } from "@/utils/currencies";

function LineChartDisplay({
  projects,
  currencies,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  const [filteredData, setFilteredData] = useState<LineData[] | undefined>();
  const [projectData, setProjectData] = useState<Project[] | undefined>();
  const [currencyList, setCurrencyList] = useState<Amount[] | undefined>();
  const [paymentData, setPaymentData] = useState<LineData[] | undefined>();

  const [projectId, setProjectId] = useState("");
  const [range, setRange] = useState("last 1 year");
  const [currencyCode, setCurrencyCode] = useState(
    ""
  );

  const { userData } = useAuth();

  const getData = async () => {
    try {
      if (!userData || !projects || !currencies) {
        return;
      }

      setProjectData(projects);
      setProjectId(projects[0].id);

      const paymentAmounts: Amount[] = [];
      const chart: LineData[] = [];

      projects.forEach(project => {
        project.payments?.forEach(payment => {

          const amount = checkArray(payment.payment_amounts)
    
          if (amount) {
            chart.push({
              name: payment.date,
              value: +amount.amount,
              project_id: project.id,
              code: amount.code,
            });
    
            payment.is_paid && paymentAmounts.push({ ...amount });
          }
        })
      })

      const uniqueCurrency = getUniqueObjects(paymentAmounts, "code");

      setCurrencyList(uniqueCurrency);
      setCurrencyCode(uniqueCurrency[0].code);

      // SORT CHART BY DATE IN ASCENDING ORDER (NAME KEY IS THE DATE)
      const sortedChart = sortDate(chart, "name", true);
      // FILTER BY THE FIRST PROJECT AND THE FIRST CODE LISTED
      const filterChart = sortedChart.filter(
        (item) =>
          item.project_id === projects[0].id &&
          item.code === uniqueCurrency[0].code &&
          dateRangeFilter(item.name, range)
      );

      // KEEP THIS AS PURE DATA FOR FILTERING PURPOSES
      setPaymentData(sortedChart);

      // ACCUMULATE TOTAL AMOUNTS BASED ON THE DATE
      // EXAMPLE: AUG 12, 2021 => 309.45; AUG 12, 2021 => 405.00; AUG 19, 2021 => 203.76
      // OUTPUT: AUG 12, 2021 => 714.45; AUG 19, 2021 => 203.76
      // name => date; value => amount
      setFilteredData(chartFormatTotal(filterChart, "name", "value"));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, [projects, currencies]);

  const filterPayments = () => {
    if (paymentData) {
      const filterChart = paymentData.filter(
        (item) =>
          item.project_id === projectId &&
          item.code === currencyCode &&
          dateRangeFilter(item.name, range)
      );

      setFilteredData(chartFormatTotal(filterChart, "name", "value"));
    }
  };

  useEffect(() => {
    filterPayments();
  }, [projectId, currencyCode, range]);

  return (
    <div className="h-[45vh] flex flex-col">
      <div className="mb-4">
        <div className="flex gap-10 justify-between items-start">
          <div>
            <ChartHeading
              text="At a Glance"
              subtext={`All payments made for project ${
                projectData?.find((item) => item.id === projectId)?.name ?? "-"
              } within the ${range.length ? range : "..."}`}
            />
          </div>
          {filteredData ? (
            <div className="">
              <TextButton
                href="/charts"
                text="See more"
                iconDirection="right"
              />
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 md:flex md:justify-between items-center gap-2 md:max-w-[65%]">
          <SelectBar
            valueChange={setProjectId}
            className=""
            value={projectId}
            placeholder="Select a project"
            label="Projects"
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
            valueChange={setCurrencyCode}
            className=""
            value={currencyCode}
            placeholder="Select a currency"
            label="Currencies"
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
          <SelectBar
            valueChange={setRange}
            className=""
            value={range}
            placeholder="Select a range"
            label="Ranges"
          >
            {["Last week", "Last 1 month", "Last 1 year"].map((item) => {
              return (
                <SelectItem value={item.toLowerCase()} key={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
        </div>
      </div>

      <div className="w-full flex-1">
        {filteredData?.length && currencyCode.length ? (
          <div className="mt-8 w-full h-full">
            <LineChart2
              data={filteredData}
              code={currencyCode}
              dateFormat
              format
            />
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
