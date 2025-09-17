import { User } from "@/types/types";
import React from "react";
import PaidCount from "./PaidCount";
import UnpaidCount from "./UnpaidCount";
import PendingCount from "./PendingCount";
import StatusBar from "./StatusBar";
import ContractorPie from "./ContractorPie";
import PaymentPie from "./PaymentPie";
import ContractorPayments from "./ContractorPayments";
import Card from "@/components/ui/cards/MyCard";
import ContractorPaymentBar from "./ContractorPaymentBar";
import LineChartDisplay from "../../dashboard/LineChartDisplay";

function Charts({
  timePeriod,
  user,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
}) {
  return (
    <>
      <div className="grid grid-cols-6 gap-4 row-auto">
        <Card className="col-span-4">
          <StatusBar user={user} timePeriod={timePeriod}/>
        </Card>
        <Card className="col-span-2">
          <ContractorPie user={user} timePeriod={timePeriod}/>
        </Card>
        <div className="col-span-1 grid gap-4">
          <Card>
            <PaidCount />
          </Card>
          <Card>
            <PendingCount />
          </Card>
          <Card>
            <UnpaidCount />
          </Card>
        </div>
        <Card className="col-span-2">
          <PaymentPie user={user} timePeriod={timePeriod}/>
        </Card>
        <Card className="col-span-3">
          <ContractorPayments user={user} timePeriod={timePeriod}/>
        </Card>
      </div>
      <Card>
        <LineChartDisplay />
      </Card>
      <Card>
        <ContractorPaymentBar />
      </Card>
    </>
  );
}

export default Charts;
