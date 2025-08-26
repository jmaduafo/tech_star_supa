"use client";
import React, { useState, useEffect } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header1 from "@/components/fontsize/Header1";
import Header2 from "@/components/fontsize/Header2";
import Header4 from "@/components/fontsize/Header4";
import { Amount, MultiSelect, User } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { convertCurrency, totalSum } from "@/utils/currencies";
import Loading from "@/components/ui/loading/Loading";
import Reset from "@/components/ui/buttons/Reset";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Header6 from "@/components/fontsize/Header6";
import MultiSelectBar from "@/components/ui/input/MultiSelectBar";
import { createClient } from "@/lib/supabase/client";

function AmountDisplay({ user }: { readonly user: User | undefined }) {
  const [allProjects, setAllProjects] = useState<MultiSelect[] | undefined>();
  const [allContractors, setAllContractors] = useState<
    MultiSelect[] | undefined
  >();

  const [selectedProjects, setSelectedProjects] = useState<MultiSelect[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<MultiSelect[]>(
    []
  );
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [allContracts, setAllContracts] = useState<Amount[] | undefined>();
  const [allPayments, setAllPayments] = useState<Amount[] | undefined>();

  const [loading, setLoading] = useState(false);

  const [allTotals, setAllTotals] = useState({
    noncontractPayments: 0,
    contractPayments: 0,
    contracts: 0,
  });

  const supabase = createClient();

  // GETS ALL PROJECT AND CONTRACTOR NAMES BASED ON THE USER'S TEAM ID
  async function allData() {
    try {
      if (!user) {
        return;
      }

      const [projects, contractors, contracts, payments] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name")
          .eq("team_id", user.team_id)
          .throwOnError(),
        supabase
          .from("contractors")
          .select("id, name")
          .eq("team_id", user.team_id)
          .throwOnError(),
        supabase
          .from("contract_amounts")
          .select("*, contracts (*)")
          .eq("contracts.team_id", user.team_id)
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select("*, payments (*) ")
          .eq("payments.team_id", user.team_id)
          .throwOnError(),
      ]);

      const newProjects: MultiSelect[] = [];
      const newContractors: MultiSelect[] = [];

      projects.data.forEach((item) => {
        newProjects.push({ label: item.name, value: item.id });
      });

      contractors.data.forEach((item) => {
        newContractors.push({ label: item.name, value: item.id });
      });

      setAllProjects(newProjects);
      setAllContractors(newContractors);

      setAllContracts(contracts.data);
      setAllPayments(payments.data);

      console.log(contracts.data);
      console.log(payments.data);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    allData();
  }, [user]);

  // RETRIEVES CALCULATIONS OF REVISED CONTRACTS & PAYMENTS WITHIN AND OUTSIDE CONTRACTS

  async function totalAmount() {
    setLoading(true);

    const contracts: Amount[] = [];
    const payments: Amount[] = [];

    try {
      if (!selectedCurrency.length || !allPayments || !allContracts) {
        return;
      }

      const findSymbol = currency_list.find(
        (item) => item.code === selectedCurrency
      );

      allContracts.forEach((item) => {
        contracts.push(item);
      });
      
      allPayments.forEach((item) => {
        payments.push(item);
      });

      const projectIds = selectedProjects.map((item) => item.value);
      const contractorIds = selectedContractors.map((item) => item.value);

      const contractFilter = contracts.filter((item) => {
        return item.contracts
          ? projectIds.includes(item.contracts.project_id) ||
              contractorIds.includes(item.contracts.contractor_id) ||
              selectedCurrency.includes(item.code)
          : [];
      });
      setCurrencySymbol(findSymbol ? findSymbol.symbol : "");

      const paymentFilter = payments.filter((item) => {
        return item.payments
          ? projectIds.includes(item.payments.project_id) ||
              contractorIds.includes(item.payments.contractor_id) ||
              selectedCurrency.includes(item.code)
          : [];
      });

      const withinPayment = paymentFilter
        .filter((item) =>
          item.payments ? item.payments.contract_id !== null : []
        )
        .map((item) => +item.amount);
      const outsidePayment = paymentFilter
        .filter((item) =>
          item.payments ? item.payments.contract_id === null : []
        )
        .map((item) => +item.amount);
      const contract = contractFilter.map((item) =>
        item.amount !== "Unlimited" ? +item.amount : 0
      );

      setAllTotals({
        contractPayments: totalSum(withinPayment),
        noncontractPayments: totalSum(outsidePayment),
        contracts: totalSum(contract),
      });
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSelectedContractors([]);
    setSelectedProjects([]);
    setSelectedCurrency("");
    setCurrencySymbol("");
    setAllTotals({
      contractPayments: 0,
      contracts: 0,
      noncontractPayments: 0,
    });
  }

  // The condition to either show the amount display or the "No payments available"
  const amountView =
    allTotals?.contracts ||
    allTotals?.contractPayments ||
    allTotals?.noncontractPayments ? (
      <div className="mt-6 flex justify-between items-end">
        <div className="flex flex-col items-center">
          <div className="flex items-start gap-3">
            <Header1
              text={convertCurrency(
                allTotals.contractPayments + allTotals.noncontractPayments
              )}
              className="font-semibold"
            />
            {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
          </div>
          <Header6 text="Total Payment Made" />
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col items-center">
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.contracts)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <p className="text-[14.5px]">Total Revised Contracts</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.contractPayments)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <p className="text-[14.5px]">Total Within Contract</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start gap-3">
              <Header2
                text={convertCurrency(allTotals.noncontractPayments)}
                className="font-medium"
              />
              {currencySymbol.length ? <Header4 text={currencySymbol} /> : null}
            </div>
            <p className="text-[14.5px]">Total Outside Contract</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start gap-3">
              <Header2
                text={`${
                  allTotals.contracts -
                    (allTotals.noncontractPayments +
                      allTotals.contractPayments) <
                  0
                    ? "-"
                    : ""
                }${convertCurrency(
                  allTotals.contracts -
                    (allTotals.noncontractPayments + allTotals.contractPayments)
                )}`}
                className={`${
                  allTotals.contracts -
                    (allTotals.noncontractPayments +
                      allTotals.contractPayments) <
                  0
                    ? "text-red-500"
                    : "text-lightText"
                } font-medium`}
              />
              {currencySymbol.length ? (
                <Header4
                  text={currencySymbol}
                  className={`${
                    allTotals.contracts -
                      (allTotals.noncontractPayments +
                        allTotals.contractPayments) <
                    0
                      ? "text-red-500"
                      : "text-lightText"
                  }`}
                />
              ) : null}
            </div>
            <p className="text-[14.5px]">Total Balance</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="py-8 flex justify-center items-center">
        <NotAvailable text="No payments available" />
        <p></p>
      </div>
    );

  return (
    <div className="">
      <div className="flex gap-4">
        <MultiSelectBar
          name={"projects"}
          array={allProjects}
          selectedArray={selectedProjects}
          setSelectedArray={setSelectedProjects}
        />
        <MultiSelectBar
          name={"contractors"}
          array={allContractors}
          selectedArray={selectedContractors}
          setSelectedArray={setSelectedContractors}
        />
        <SelectBar
          valueChange={setSelectedCurrency}
          value={selectedCurrency}
          placeholder="Select a currency"
          label="Currencies"
        >
          {currency_list.map((item) => {
            return (
              <SelectItem
                className="cursor-pointer"
                key={item?.name}
                value={item?.code}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectBar>
        <div className="flex gap-1.5">
          <CheckedButton
            clickedFn={totalAmount}
            disabledLogic={
              !selectedContractors.length &&
              !selectedProjects.length &&
              !selectedCurrency.length
            }
          />
          <Reset clickedFn={reset} />
        </div>
      </div>
      {/* IF NOT LOADING, THEN DISPLAY "amountView" above*/}
      {loading ? (
        <div className="mt-6 flex justify-center">
          <Loading />
        </div>
      ) : (
        amountView
      )}
    </div>
  );
}

export default AmountDisplay;
