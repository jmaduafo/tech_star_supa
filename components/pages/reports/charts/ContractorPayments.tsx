import Header5 from "@/components/fontsize/Header5";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import SelectBar from "@/components/ui/input/SelectBar";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { SelectItem } from "@/components/ui/select";
import { Amount, Contractor, Project, User } from "@/types/types";
import { chartFormatTotal, topContractors } from "@/utils/chartHelpers";
import { formatCurrency } from "@/utils/currencies";
import { switchPeriod } from "@/utils/dateAndTime";
import { sortByNumOrBool } from "@/utils/sortFilter";
import React, { useEffect, useState } from "react";

function ContractorPayments({
  timePeriod,
  user,
  currency_code,
  currency_symbol,
  project_id,
  projects,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly user: User | undefined;
  readonly projects: Project[] | undefined;
}) {
  const [contractorsData, setContractorsData] = useState<any[] | undefined>();

  const getData = () => {
    if (!project_id.length || !projects || !currency_code.length) {
      return;
    }

    const project = projects.find((item) => item.id === project_id);

    if (!project) {
      return;
    }

    const contractors = project.contractors;

    const chart = topContractors(
      contractors as Contractor[],
      currency_code,
      switchPeriod(timePeriod)
    );

    const sortedChart = sortByNumOrBool(chart, "paymentAmount", "desc");

    setContractorsData(sortedChart);
  };

  useEffect(() => {
    getData();
  }, [project_id, currency_code, timePeriod]);

  return (
    <div className="h-full w-full">
      {!contractorsData ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full">
          <ChartHeading
            text="Top Contractors"
            subtext={
              timePeriod !== "All Time"
                ? `Contractors ranked on paid ${currency_code} payments over the past ${switchPeriod(
                    timePeriod
                  )}`
                : `Contractors ranked by paid ${currency_code} payments`
            }
          />
          <div className="mt-auto max-h-[60%]">
            <div
              className={`text-lightText/70 flex items-center py-3 px-2 border-b border-b-lightText/20`}
            >
              <div className="flex-1">
                <Paragraph text={`Rank`} />
              </div>
              <div className="flex-[2]">
                <Paragraph text="Contractors" />
              </div>
              <div className="flex-[4]">
                <Paragraph className="text-right" text="Amount" />
              </div>
            </div>
            {contractorsData.map((item, i) => {
              return (
                <div
                  key={item.name}
                  className={`flex items-center py-3 px-2 border-b border-b-lightText/20`}
                >
                  <div className="flex-1">
                    <Header6 text={`${i + 1}`} />
                  </div>
                  <div className="flex-[2]">
                    <Header6 text={item.name} />
                  </div>
                  <div className="flex-[4]">
                    <Header6
                      className="text-right"
                      text={`${formatCurrency(
                        +item.paymentAmount,
                        currency_code
                      )}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorPayments;
