import Header3 from "@/components/fontsize/Header3";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import Loading from "@/components/ui/loading/Loading";
import { contractorColumns } from "@/components/ui/tables/columns";
import MainTable from "@/components/ui/tables/MainTable";
import { Contractor, Project } from "@/types/types";
import { optionalS } from "@/utils/optionalS";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

function ContractorsDisplay({
  projects,
  selectedProject,
}: {
  readonly projects: Project[] | undefined;
  readonly selectedProject: string;
}) {
  const [data, setData] = useState<Contractor[] | undefined>();

  const getLatest = () => {
    if (!projects || !selectedProject.length) {
      return;
    }

    const project = projects.find((item) => item.id === selectedProject);

    if (!project) {
      return;
    }

    const contractors: Contractor[] = [];

    project.contractors?.forEach((contractor) => {
      contractors.push(contractor);
    });

    // ORDER THE PAYMENTS IN DESCENDING ORDER
    const orderedPayment = contractors.toSorted((a, b) => {
      return (
        new Date(format(`${b.start_month} ${b.start_year}`, "P")).getTime() -
        new Date(format(`${a.start_month} ${a.start_year}`, "P")).getTime()
      );
    });

    // ONLY GET 5 AT MOST
    setData(orderedPayment.slice(0, 5));
  };

  useEffect(() => {
    getLatest();
  }, [projects, selectedProject]);

  return <section className="w-full">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-5">
          {/* LATEST HEADING WITH CONTRACTOR COUNT */}
          <Header3 text="Latest Contractors" />
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
              href="/tables/contractors"
              text="View all"
              iconDirection="right"
            />
          ) : null}
        </div>
      </div>
      <div className="mt-6">
        {data ? (
          <MainTable
            columns={contractorColumns}
            data={data}
            is_payment={false}
            team_name={"My"}
            filterCategory="description"
          />
        ) : (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        )}
      </div>
    </section>
}

export default ContractorsDisplay;
