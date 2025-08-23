"use client";

import { useAuth } from "@/context/UserContext";
import { Contract, Payment } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Banner from "@/components/ui/Banner";
import { createClient } from "@/lib/supabase/client";
import PaymentDisplay from "./PaymentDisplay";

function MainPage() {
  const [data, setData] = useState<Payment[] | undefined>();
  const [contractData, setContractData] = useState<Contract | undefined>();

  const { userData } = useAuth();
  const { project_id, contractor_id, contract_id } = useParams();
  const supabase = createClient();

  const getData = async () => {
    try {
      if (!userData || !project_id || !contractor_id || !contract_id) {
        return;
      }

      const [contract, payments] = await Promise.all([
        supabase
          .from("contracts")
          .select(
            `*, projects (name), contractors (name), stages ( id, name ), contract_amounts (*)`
          )
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id)
          .eq("id", contract_id)
          .eq("team_id", userData.team_id)
          .single()
          .throwOnError(),
        supabase
          .from("payments")
          .select(
            `*, projects (name), contractors (name), stages ( id, name ), contracts (contract_code), payment_amounts (*)`
          )
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id)
          .eq("contract_id", contract_id)
          .eq("team_id", userData.team_id)
          .throwOnError(),
      ]);

      setData(payments.data as Payment[]);
      setContractData(contract.data as Contract);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            table: "contract_amounts",
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
            table: "payment_amounts",
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
      data,
      setData,
      contractData,
      setContractData
    ]);

  return (
    <>
      <div className="">
        <div className="flex items-start gap-5 mb-2 text-lightText">
          {contractData ? <Header1 text={contractData.contract_code} /> : null}
        </div>
        <div className="mb-3">
          {contractData ? (
            <Banner
              text={contractData.is_completed ? "completed" : "ongoing"}
            />
          ) : null}
        </div>
      </div>
      {/* BREADCRUMB DISPLAY */}
      <div className="mb-8">
        {contractData ? (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${project_id}/contractors`}>
                  {contractData.projects?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/projects/${project_id}/contractors/${contractor_id}/contracts`}
                >
                  {contractData.contractors?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{contractData.contract_code}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
      </div>
      <PaymentDisplay user={userData} data={data} contract={contractData} />
    </>
  );
}

export default MainPage;
