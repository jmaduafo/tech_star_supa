"use client";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { optionalS } from "@/utils/optionalS";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";
import { Contract, Payment, Stage } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { contractorStages } from "@/utils/stagesFilter";
import ContractDisplay from "./ContractDisplay";
import NonContractDisplay from "./NonContractDisplay";

function MainPage() {
  const [contractData, setContractData] = useState<Contract[] | undefined>();
  const [nonContractData, setNonContractData] = useState<
    Payment[] | undefined
  >();
  const [stagesData, setStagesData] = useState<Stage[] | undefined>();

  const [projectName, setProjectName] = useState("");
  const [contractorName, setContractorName] = useState("");

  const { userData } = useAuth();
  const supabase = createClient();
  const { project_id, contractor_id } = useParams();

  // RETRIEVE CONTRACTOR DATA
  const getData = async () => {
    try {
      if (!userData || !contractor_id || !project_id) {
        return;
      }

      const [contract, noncontract, stages] = await Promise.all([
        supabase
          .from("contracts")
          .select(
            `*, projects (name), contractors (name), stages ( id, name ), contract_amounts (*)`
          )
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id)
          .eq("team_id", userData.team_id),
        supabase
          .from("payments")
          .select(
            `*, projects (name), contractors (name), stages ( id, name ), contracts (contract_code), payment_amounts (*)`
          )
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id)
          .eq("team_id", userData.team_id),
        supabase
          .from("stages")
          .select("id, name, stage_contractors ( contractor_id )")
          .eq("stage_contractors.contractor_id", contractor_id)
          .eq("team_id", userData.team_id),
      ]);

      if (contract.error) {
        toast("Something went wrong", {
          description: contract.error.message,
        });

        return;
      }

      if (noncontract.error) {
        toast("Something went wrong", {
          description: noncontract.error.message,
        });

        return;
      }

      if (stages.error) {
        toast("Something went wrong", {
          description: stages.error.message,
        });

        return;
      }

      console.log(contract)
      console.log(noncontract)

      setContractData(contract.data as Contract[]);
      setNonContractData(noncontract.data as Payment[]);
      setStagesData(contractorStages(stages.data));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // RETRIEVE NAMES FOR BREADCRUMBS LINKS
  const getNames = async () => {
    try {
      if (!project_id || !contractor_id) {
        return;
      }

      const [project, contractor] = await Promise.all([
        supabase.from("projects").select("name").eq("id", project_id).single(),
        supabase
          .from("contractors")
          .select("name")
          .eq("id", contractor_id)
          .single(),
      ]);

      if (project.error) {
        toast("Something went wrong", {
          description: project.error.message,
        });

        return;
      }

      if (contractor.error) {
        toast("Something went wrong", {
          description: contractor.error.message,
        });

        return;
      }

      setProjectName(project.data.name);
      setContractorName(contractor.data.name);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
    getNames();
  }, [project_id, contractor_id]);

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contracts",
        },
        (payload) => getData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        (payload) => getData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stages",
        },
        (payload) => getData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    supabase,
    nonContractData,
    setNonContractData,
    contractData,
    setContractData,
  ]);

  return (
    <div>
      <div className="">
        <div className="flex items-start gap-5 mb-2 text-lightText">
          {contractorName.length ? <Header1 text={contractorName} /> : null}
          {contractData && nonContractData ? (
            <Header6
              text={`${
                contractData.length + nonContractData.length
              } result${optionalS(
                contractData.length + nonContractData.length
              )}`}
            />
          ) : null}
        </div>
      </div>
      {/* BREADCRUMB DISPLAY */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            {projectName.length ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/projects/${project_id}/contractors`}>
                    {projectName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            {contractorName.length ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{contractorName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mt-10">
        <ContractDisplay
          stages={stagesData}
          data={contractData}
          user={userData}
        />
      </div>
      <div className="mt-10">
        <NonContractDisplay
          stages={stagesData}
          data={nonContractData}
          user={userData}
        />
      </div>
    </div>
  );
}

export default MainPage;
