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
import { User } from "@/types/types";
import Activities from "./Activities";

function DashboardGrid() {
  const [user, setUser] = useState<User | undefined>();

  const { userData } = useAuth();
  const supabase = useMemo(() => createClient(), [])

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
    getUser()
  }, [])

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
    <div className="dashGrid h-auto gap-4">
      {/* Greeting */}
      <Card className="greeting">
        <Greeting user={user} />
      </Card>
      {/* Amount Display */}
      <div className="calc">
        <AmountDisplay user={user} />
      </div>
      {/* Line chart */}
      <Card className="line">
        <Activities user={user} />
      </Card>
      {/* Pie chart */}
      <Card className="pie">
        <PieChartDisplay user={user} />
      </Card>
      {/* Contractors */}
      <Card className="contractors">
        <ContractorCount user={user} />
      </Card>
      {/* Project */}
      <Card className="project">
        <ProjectCount user={user} />
      </Card>
    </div>
  );
}

export default DashboardGrid;
