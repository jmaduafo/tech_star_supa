import React from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";
import LineChartDisplay from "./LineChartDisplay";
import Card from "@/components/ui/cards/MyCard";

function MainPage() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardGrid />
      <Card className="">
        <LineChartDisplay />
      </Card>
      <PaymentDisplay />
    </div>
  );
}

export default MainPage;
