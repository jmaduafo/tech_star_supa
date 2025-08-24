import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  password?: string;
  image_url: string | null;
  is_owner: boolean;
  bg_image_index: number;
  team_id: string;
  role: "admin" | "editor" | "viewer";
  job_title: string | null;
  hire_type: "employee" | "contractor" | "independent";
  is_online: boolean;
  location: string | null;
  created_at: string;
  updated_at: string | null;
};

export interface DataTableProps<TData, TValue> {
  readonly columns: ColumnDef<TData, TValue>[];
  readonly data: TData[];
  readonly is_payment: boolean;
  readonly is_export?: boolean;
  readonly team_name: string;
  readonly advanced?: boolean;
  readonly filterCategory: string;
  readonly showSelections?: boolean;
}

export type ChartData = { name: string; value: number };

export type UserItem = {
  id: string;
  team_id?: string;
};

export type Item = {
  id: string;
  team_id?: string;
};

// When a new user logs in for the first time, they are put into a brand new team
// and are automatically set as an admin. They are the only ones that can add, edit,
// and remove users as well as assign the role of admin
export type Team = {
  id: string;
  // Owner can add the name of the company or organization that they're under
  organization_name?: string | null;
  name: string;
};

export type TimeStamp = {
  nanoseconds: number;
  seconds: number;
};

export type MultiSelect = {
  label: string;
  value: string;
};

export type Currencies = {
  id: string;
  symbol: string;
  code: string;
  name: string;
  project_id: string;
  project_name: string;
  contractor_id: string;
  contractor_name: string;
  team_id: string;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  team_id: string;
  city?: string | null;
  country: string;
  start_month: string;
  start_year: number;
  relevance: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string | null;
};

export type Stage = {
  id: string;
  name: string;
  team_id?: string;
  project_id?: string;
  description?: string;
  stage_number?: number;
  stage_contractors?: StageContractor[];
  is_completed?: boolean;
  created_at?: number;
  updated_at?: number | null;
};

// MANY TO MANY RELATIONSHIP BETWEEN STAGES AND CONTRACTORS
export type StageContractor = {
  id?: string;
  stage_id?: string;
  contractor_id: string;
  created_at?: number;
  updated_at?: number | null;
};

export type Contractor = {
  id: string;
  name: string;
  project_id: string;
  team_id: string;
  city?: string | null;
  country: string;
  relevance: number;
  description: string;
  start_month: string;
  start_year: number;
  projects: Project;
  comment?: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
};

// amount: number or "Unlimited"
export type Amount = {
  id?: string;
  symbol: string;
  code: string;
  name: string;
  amount: string;
  contract_id?: string | null;
  payment_id?: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type Contract = {
  id: string;
  date: string;
  project_id: string;
  contractor_id: string;
  team_id: string;
  stage_id: string;
  contract_code: string;
  bank_names: string[];
  contract_amounts: Amount[];
  projects: Project;
  contractors: Contractor;
  stages: Stage;
  is_completed: boolean;
  description: string;
  comment?: string | null;
  created_at: string;
  updated_at: string | null;
};

// Since NonContract is also a Payment, schema has to match with Payment
export type Payment = {
  id: string;
  date: string;
  project_id: string;
  contractor_id: string;
  contract_id: string | null;
  stage_id: string;
  team_id: string;
  projects: Project;
  contractors: Contractor;
  stages: Stage;
  contracts: Contract | null;
  description: string;
  comment: string | null;
  bank_name: string;
  payment_amounts: Amount[];
  is_contract: boolean;
  contract_code: string | null;
  is_completed: boolean;
  is_paid: boolean;
  created_at: string;
  updated_at: string | null;
};

export type Chart = {
  id: string;
  date: string;
  amount: string;
  project_id: string;
  currency_code: string;
};

export type ProjectReport = {
  name: string;
  total_payments: number;
  total_contracts: number;
  contracts: Contract[];
  expenses: Payment[];
};
