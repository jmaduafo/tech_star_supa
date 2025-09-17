import { User } from "@/types/types";
import React from "react";

function Tables({
  timePeriod,
  user,
  currency_symbol,
  project_id,
  currency_code
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly user: User | undefined;
  
}) {
  return <div>Tables</div>;
}

export default Tables;
