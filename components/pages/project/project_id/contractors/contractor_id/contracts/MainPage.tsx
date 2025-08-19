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
import React, { useState } from "react";
import { useAuth } from "@/context/UserContext";
import { Contract, Payment } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { toast } from "sonner";

function MainPage() {
  const [contractData, setContractData] = useState<Contract[] | undefined>();
  const [nonContractData, setNonContractData] = useState<
    Payment[] | undefined
  >();

  const [projectName, setProjectName] = useState("");
  const [contractorName, setContractorName] = useState("");

  const { userData } = useAuth();
  const supabase = createClient();
  const { project_id, contractor_id } = useParams();

  // RETRIEVE CONTRACTOR DATA
  const getData = async () => {
    try {
      if (!userData || !project_id) {
        return;
      }

      const { data, error } = await supabase
        .from("contractors")
        .select("*")
        .eq("team_id", userData.team_id)
        .eq("project_id", project_id);

      const [contract, noncontract] = await Promise.all([
        supabase
          .from("contracts")
          .select("*")
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id),
        supabase.from("payments").select("*").eq("id", contractor_id).single(),
      ]);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      setContractData(data as Contract[]);
      setNonContractData(data as Payment[]);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // RETRIEVE NAMES FOR BREADCRUMBS LINKS
  const getNames = async () => {
    try {
      if (!userData || !project_id || !contractor_id) {
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
      console.log(err.message);
    }
  };

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
                <BreadcrumbSeparator />
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
      <div className="flex items-center gap-3">
        <div className="flex-1"></div>
      </div>
      <div className="mt-10">
        {/* <ContractorDisplay
          user={userData}
          allContractors={filteredContractors}
        /> */}
      </div>
    </div>
  );
}

export default MainPage;
