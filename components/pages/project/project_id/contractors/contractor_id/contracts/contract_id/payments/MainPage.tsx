"use client";

import { useAuth } from "@/context/UserContext";
import { Amount, Contract, Payment, Versus } from "@/types/types";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
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
import MainTitle from "@/components/ui/labels/MainTitle";
import {
  contractPayments,
  revisedContract,
  totalBalance,
  totalPending,
  totalUnpaid,
} from "@/utils/kpi";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { currency_list } from "@/utils/dataTools";
import KpiCard from "@/components/ui/cards/KpiCard";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import Loading from "@/components/ui/loading/Loading";

function MainPage() {
  const [data, setData] = useState<Payment[] | undefined>();
  const [contractData, setContractData] = useState<Contract | undefined>();

  const [currencyList, setCurrencyList] = useState<Amount[] | undefined>();
  const [kpis, setKpis] = useState<Versus[] | undefined>();

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");

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
            `*, projects (name), contractors (name), stages ( id, name ), contracts (contract_code, contract_amounts ( * )), payment_amounts (*)`
          )
          .eq("project_id", project_id)
          .eq("contractor_id", contractor_id)
          .eq("contract_id", contract_id)
          .eq("team_id", userData.team_id)
          .throwOnError(),
      ]);

      setData(payments.data as Payment[]);
      setContractData(contract.data as Contract);

      const contract_amounts = payments.data[0]?.contracts?.contract_amounts;

      if (contract_amounts) {
        setCurrencyList(contract_amounts);
        setSelectedCurrency(contract_amounts[0].code);
        setSelectedSymbol(contract_amounts[0].symbol);

        setKpis([
          revisedContract(payments.data, contract_amounts[0].code),
          contractPayments(payments.data, contract_amounts[0].code),
          totalBalance(payments.data, contract_amounts[0].code),
          totalPending(payments.data, contract_amounts[0].code),
          totalUnpaid(payments.data, contract_amounts[0].code),
        ]);
      }
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
  }, [supabase, data, setData, contractData, setContractData]);

  const changeCurrency = (code: string) => {
    setSelectedCurrency(code);

    const currency = currency_list.find((item) => item.code === code);

    currency && setSelectedSymbol(currency.symbol);

    if (data) {
      setKpis([
        revisedContract(data, code),
        contractPayments(data, code),
        totalBalance(data, code),
        totalPending(data, code),
        totalUnpaid(data, code),
      ]);
    }
  };

  const contract_summary = [
    {
      title: "Revised contract amount",
      symbol: selectedSymbol,
      visual: false,
      className: "",
    },
    {
      title: "Contract payment total",
      symbol: selectedSymbol,
      visual: false,
      className: "md:col-span-2 xl:col-span-1",
    },
    {
      title: "Total balance",
      symbol: selectedSymbol,
      visual: false,
      className: "",
    },
    {
      title: "Total pending",
      symbol: selectedSymbol,
      visual: false,
      className: "",
    },
    {
      title: "Total unpaid",
      symbol: selectedSymbol,
      visual: false,
      className: "",
    },
  ];

  return (
    <>
      <div className="">
        {contractData && data ? (
          <MainTitle title={contractData?.contract_code} data={data} />
        ) : null}
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
      {kpis ? (
        <div>
          <SelectBar
            placeholder="Select a currency"
            label="Currencies"
            value={selectedCurrency}
            valueChange={(name) => changeCurrency(name)}
          >
            {currencyList
              ? currencyList.map((item) => {
                  return (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectBar>
        </div>
      ) : null}
      {kpis ? (
        <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4 mt-2 mb-6">
          {contract_summary.map((item, i) => {
            return (
              <Fragment key={item.title}>
                <KpiCard item={item} arr={kpis ?? []} index={i} />
              </Fragment>
            );
          })}
        </div>
      ) : null}
      <PaymentDisplay user={userData} data={data} contract={contractData} />
    </>
  );
}

export default MainPage;
