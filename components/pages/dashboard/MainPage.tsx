import React from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";
import LineChartDisplay from "./LineChartDisplay";
import Card from "@/components/ui/cards/MyCard";

function MainPage() {
  return (
    <>
      <DashboardGrid />
      <Card className="mt-8">
        <LineChartDisplay />
      </Card>
      <div className="mt-8">
        <PaymentDisplay />
      </div>
    </>
  );
}

export default MainPage;
