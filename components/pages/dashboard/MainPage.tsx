"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";
import LineChartDisplay from "./LineChartDisplay";
import Card from "@/components/ui/cards/MyCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/UserContext";
import { Project, Amount } from "@/types/types";
import { getUniqueObjects } from "@/utils/chartHelpers";

function MainPage() {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const supabase = useMemo(() => createClient(), []);
  const { userData } = useAuth();

  const getData = async () => {
    try {
      if (!userData) {
        return;
      }

      const [projects, contractCurrencies, paymentCurrencies] =
        await Promise.all([
          supabase
            .from("projects")
            .select(
              "id, name, contractors ( id, name, is_available ), contracts ( id, contract_code, date, is_completed, contract_amounts ( * ) ), payments ( *, payment_amounts ( * ) )"
            )
            .eq("team_id", userData.team_id)
            .order("created_at", { ascending: false })
            .throwOnError(),
          supabase
            .from("contract_amounts")
            .select(
              "id, contract_id, name, symbol, code, contracts ( id, team_id, project_id, contractor_id )"
            )
            .eq("contracts.team_id", userData.team_id)
            .throwOnError(),
          supabase
            .from("payment_amounts")
            .select(
              "id, payment_id, name, symbol, code, payments ( id, team_id, project_id, contractor_id )"
            )
            .eq("payments.team_id", userData.team_id)
            .throwOnError(),
        ]);

      setAllProjects(projects.data as unknown as Project[]);

      setCurrenciesList(
        getUniqueObjects(
          [...contractCurrencies.data, ...paymentCurrencies.data],
          "code"
        )
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <DashboardGrid projects={allProjects} currencies={currenciesList} />
      <Card className="">
        <LineChartDisplay projects={allProjects} currencies={currenciesList} />
      </Card>
      <PaymentDisplay projects={allProjects} currencies={currenciesList} />
    </div>
  );
}

export default MainPage;
