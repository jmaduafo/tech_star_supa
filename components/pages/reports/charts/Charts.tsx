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
import ContractPaymentArea from "./ContractPaymentArea";
import ActivitiesBar from "./ActivitiesBar";

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
      <div className="grid md:grid-cols-4 xl:grid-cols-6 gap-4 row-auto">
        <Card className="md:col-span-4 xl:col-span-4">
          <ActivitiesBar timePeriod={timePeriod} user={user} />
        </Card>
        <Card className="md:col-span-3 xl:col-span-2">
          <ContractorPie
            project_id={project_id}
            projects={projects}
            user={user}
            timePeriod={timePeriod}
          />
        </Card>
        <div className="md:col-span-1 grid gap-4">
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
        <Card className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <PaymentPie
            project_id={project_id}
            projects={projects}
            currencies={currencies}
            user={user}
            timePeriod={timePeriod}
          />
        </Card>
        <Card className="md:col-span-2 xl:col-span-3">
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
        <ContractPaymentArea
          project_id={project_id}
          projects={projects}
          currency_code={currency_code}
          currency_symbol={currency_symbol}
          timePeriod={timePeriod}
        />
      </Card>
      <Card>
        <StatusBar
          currency_code={currency_code}
          project_id={project_id}
          projects={projects}
          user={user}
          timePeriod={timePeriod}
        />
      </Card>
    </>
  );
}

export default Charts;
