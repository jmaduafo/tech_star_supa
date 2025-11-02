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
import { greeting } from "@/utils/greeting";
import Header2 from "@/components/fontsize/Header2";
import { Progress } from "@/components/ui/progress";
import Paragraph from "@/components/fontsize/Paragraph";

function MainPage() {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [greet, setGreet] = useState("");
  const [progress, setProgress] = useState(42);

  const supabase = useMemo(() => createClient(), []);
  const { userData } = useAuth();

  useEffect(() => {
    const userGreet = setInterval(() => {
      setGreet(greeting());
    }, 1000);

    return () => clearInterval(userGreet);
  }, []);

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
              "id, name, contractors ( id, name, is_available, payments ( id, is_paid, is_completed, payment_amounts ( * )) ), contracts ( id, contract_code, date, is_completed, contract_amounts ( * ) ), payments ( *, payment_amounts ( * ) )"
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
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-start mb-1">
        <div>
          <Header2 text={`Good ${greet}, ${userData?.first_name}`} />
          <div className="flex gap-3">
            <Progress value={progress} className="w-96 mt-2" />
            <Paragraph text={`${progress}%`} />
          </div>
          <Paragraph
            text={`You are ${progress}% closer to a fully populated dashboard`}
            className="italic text-darkText/70"
          />
        </div>
        <div>
          <button className="font-light bg-darkText text-lightText px-6 py-2 rounded-full">
            + Add Project
          </button>
        </div>
      </div>
      <DashboardGrid
        projects={allProjects}
        selectedProject={selectedProject}
        selectedCurrency={selectedCurrency}
        setSelectedProject={setSelectedProject}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currenciesList}
      />
      <Card className="">
        <LineChartDisplay projects={allProjects} currencies={currenciesList} />
      </Card>
      <div className="mt-2">
        <PaymentDisplay projects={allProjects} currencies={currenciesList} />
      </div>
    </div>
  );
}

export default MainPage;
