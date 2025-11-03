"use client"

import React from "react";
import Card from "@/components/ui/cards/MyCard";
import AmountDisplay from "./AmountDisplay";
import Greeting from "./Greeting";
import ContractorCount from "./ContractorCount";
import ProjectCount from "./ProjectCount";
import PieChartDisplay from "./PieChartDisplay";
import { Amount, Project, User } from "@/types/types";
import Activities from "./Activities";
import TopContractors from "./TopContractors";

function DashboardGrid({
  projects,
  currencies,
  selectedProject,
  selectedCurrency,
  setSelectedCurrency,
  setSelectedProject,
  user
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
  readonly setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
  readonly setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
  readonly user: User | undefined;
}) {

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
    xl:[grid-template-columns:1.4fr_1fr_1fr_1fr_1fr_1fr]
    "
    >
      {/* Greeting */}
      <div className="[grid-area:greeting] flex flex-col gap-3">
        <Card className="h-[75%]">
          <TopContractors
            user={user}
            projects={projects}
            currencies={currencies}
            selectedProject={selectedProject}
            selectedCurrency={selectedCurrency}
          />
        </Card>
        <Card className="h-[25%]">
          <Greeting user={user} />
        </Card>
      </div>
      {/* Amount Display */}
      <div className="[grid-area:calc]">
        <AmountDisplay
          user={user}
          projects={projects}
          currencies={currencies}
          selectedProject={selectedProject}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          setSelectedProject={setSelectedProject}
        />
      </div>
      {/* Line chart */}
      <Card className="[grid-area:activities]">
        <Activities user={user} />
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
