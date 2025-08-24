import { DataTableProps } from "@/types/types";
import React from "react";
import DataTable from "./DataTable";

function MainTable<TData, TValue>({
  columns,
  data,
  is_payment,
  team_name,
  is_export,
  advanced,
  filterCategory,
  showSelections
}: Readonly<DataTableProps<TData, TValue>>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      is_payment={is_payment}
      team_name={team_name}
      is_export={is_export}
      advanced={advanced}
      filterCategory={filterCategory}
      showSelections={showSelections}
    />
  );
}

export default MainTable;
