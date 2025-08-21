"use client";

import React from "react";
import Card from "@/components/ui/cards/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import LineChartDisplay from "./LineChartDisplay";
import { useAuth } from "@/context/UserContext";

function DashboardGrid() {
  const { userData } = useAuth();

  return (
    <div className="dashGrid h-[75vh] gap-4">
      {/* Greeting */}
      <Card className="greeting">
        <Greeting user={userData} />
      </Card>
      {/* Amount Display */}
      <div className="calc">
        <AmountDisplay user={userData} />
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
        <ContractorCount user={userData} />
      </Card>
      {/* Project */}
      <Card className="project">
        <ProjectCount user={userData} />
      </Card>
    </div>
  );
}

export default DashboardGrid;
