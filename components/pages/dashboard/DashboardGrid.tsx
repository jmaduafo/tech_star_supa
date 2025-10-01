"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/cards/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { Amount, Project, User } from "@/types/types";
import Activities from "./Activities";

function DashboardGrid({
  projects,
  currencies,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  const [user, setUser] = useState<User | undefined>();

  const { userData } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const getUser = async () => {
    try {
      if (!userData) {
        return;
      }

      const { data } = await supabase
        .from("users")
        .select()
        .eq("id", userData.id)
        .single()
        .throwOnError();

      setUser(data as User);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${userData.id}`,
        },
        (payload) => getUser()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user, setUser]);

  return (
    <div
      className="grid h-auto gap-3
    [grid-template-areas:'greeting_greeting''calc_calc''activities_activities''activities_activities''pie_pie''pie_pie''projects_contractors']
    [grid-template-rows:auto]
    [grid-template-columns:1fr_1fr]
    sm:[grid-template-areas:'greeting_greeting_greeting''calc_calc_calc''activities_activities_activities''pie_pie_projects''pie_pie_contractors']
    sm:[grid-template-rows:auto_auto_auto_1fr_1fr]
    sm:[grid-template-columns:1.4fr_1.2fr_1fr]
    xl:[grid-template-areas:'greeting_calc_calc_calc_calc_calc''greeting_activities_activities_activities_pie_pie''greeting_activities_activities_activities_contractors_projects']
    xl:[grid-template-rows:auto_1.4fr_0.8fr]
    xl:[grid-template-columns:1.2fr_1fr_1fr_1fr_1fr_1fr]
    "
    >
      {/* Greeting */}
      <Card className="[grid-area:greeting]">
        <Greeting user={user} />
      </Card>
      {/* Amount Display */}
      <div className="[grid-area:calc]">
        <AmountDisplay
          user={user}
          projects={projects}
          currencies={currencies}
        />
      </div>
      {/* Line chart */}
      <Card className="[grid-area:activities]">
        <Activities user={user} projects={projects} currencies={currencies} />
      </Card>
      {/* Pie chart */}
      <Card className="[grid-area:pie]">
        <PieChartDisplay
          user={user}
          projects={projects}
          currencies={currencies}
        />
      </Card>
      {/* Contractors */}
      <Card className="[grid-area:contractors]">
        <ContractorCount
          user={user}
          projects={projects}
          currencies={currencies}
        />
      </Card>
      {/* Project */}
      <Card className="[grid-area:projects]">
        <ProjectCount user={user} projects={projects} currencies={currencies} />
      </Card>
    </div>
  );
}

export default DashboardGrid;
