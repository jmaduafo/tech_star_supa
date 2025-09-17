import { Amount, Project, User } from "@/types/types";
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
  currency_symbol,
  project_id,
  currency_code,
  projects,
  currencies,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly user: User | undefined;
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  return (
    <>
      <div className="grid grid-cols-6 gap-4 row-auto">
        <Card className="col-span-4">
          <StatusBar
            project_id={project_id}
            projects={projects}
            user={user}
            timePeriod={timePeriod}
          />
        </Card>
        <Card className="col-span-2">
          <ContractorPie user={user} timePeriod={timePeriod} />
        </Card>
        <div className="col-span-1 grid gap-4">
          <Card>
            <PaidCount
              project_id={project_id}
              projects={projects}
              timePeriod={timePeriod}
              currency_code={currency_code}
              currency_symbol={currency_symbol}
            />
          </Card>
          <Card>
            <PendingCount
              project_id={project_id}
              projects={projects}
              timePeriod={timePeriod}
              currency_code={currency_code}
              currency_symbol={currency_symbol}
            />
          </Card>
          <Card>
            <UnpaidCount
              project_id={project_id}
              projects={projects}
              timePeriod={timePeriod}
              currency_code={currency_code}
              currency_symbol={currency_symbol}
            />
          </Card>
        </div>
        <Card className="col-span-2">
          <PaymentPie
            project_id={project_id}
            projects={projects}
            currencies={currencies}
            user={user}
            timePeriod={timePeriod}
          />
        </Card>
        <Card className="col-span-3">
          <ContractorPayments
            project_id={project_id}
            projects={projects}
            currency_code={currency_code}
            currency_symbol={currency_symbol}
            user={user}
            timePeriod={timePeriod}
          />
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
