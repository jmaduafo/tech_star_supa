"use client"
import React from "react";
import Card from "@/components/ui/cards/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import LineChartDisplay from "./LineChartDisplay";

function DashboardGrid() {
  // const { userData } = useAuth()

  return (
    <div className="dashGrid h-[80vh] gap-4">
      {/* Greeting */}
      <Card className="greeting">
        <div></div>
        {/* <Greeting user={userData}/> */}
      </Card>
      {/* Amount Display */}
      <div className="calc">
        <div></div>
        {/* <AmountDisplay user={userData}/> */}
      </div>
      {/* Line chart */}
      <Card className="line">
        <div></div>
        {/* <LineChartDisplay user={userData} /> */}
      </Card>
      {/* Pie chart */}
      <Card className="pie">
        <div></div>
        {/* <PieChartDisplay user={userData} /> */}
      </Card>
      {/* Contractors */}
      <Card className="contractors">
        <div></div>
        {/* <ContractorCount user={userData}/> */}
      </Card>
      {/* Project */}
      <Card className="project">
        <div></div>
        {/* <ProjectCount user={userData} /> */}
      </Card>
    </div>
  );
}

export default DashboardGrid;
