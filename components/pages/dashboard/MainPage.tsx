import React from "react";
import DashboardGrid from "./DashboardGrid";
import PaymentDisplay from "./PaymentDisplay";

function MainPage() {
  return (
    <>
      <DashboardGrid />
      <div className="mt-4">
        <PaymentDisplay />
      </div>
    </>
  );
}

export default MainPage;
