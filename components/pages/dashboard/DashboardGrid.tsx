"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/cards/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import LineChartDisplay from "./LineChartDisplay";
import { User } from "@/types/types";
import { createClient } from "@/lib/supabase/client";

function DashboardGrid() {
  const [userData, setUserData] = useState<User | undefined>();

  const supabase = createClient();

  const getUser = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log(error);

      return;
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select()
      .eq("id", data?.session?.user?.id)
      .single()

    if (userError) {
      console.log(userError.message)
      return
    }

    setUserData(user as unknown as User);
    console.log(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="dashGrid h-[72vh] gap-4">
      {/* Greeting */}
      <Card className="greeting">
        <Greeting user={userData} />
      </Card>
      {/* Amount Display */}
      <div className="calc">
        <AmountDisplay user={userData}/>
      </div>
      {/* Line chart */}
      <Card className="line">
        <LineChartDisplay user={userData} />
      </Card>
      {/* Pie chart */}
      <Card className="pie">
        <PieChartDisplay user={userData} />
      </Card>
      {/* Contractors */}
      <Card className="contractors">
        <ContractorCount user={userData}/>
      </Card>
      {/* Project */}
      <Card className="project">
        <ProjectCount user={userData} />
      </Card>
    </div>
  );
}

export default DashboardGrid;
