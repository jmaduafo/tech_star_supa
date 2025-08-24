"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../button";
import { downloadToExcel } from "@/utils/export";
import { IContent } from "json-as-xlsx";
import {
  Contract,
  Contractor,
  DataTableProps,
  MultiSelect,
  Project,
} from "@/types/types";
import MultiSelectBar from "../input/MultiSelectBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/UserContext";
import Reset from "../buttons/Reset";
import CheckedButton from "../buttons/CheckedButton";

function DataTable<TData, TValue>({
  columns,
  data,
  is_payment,
  team_name,
  is_export,
  advanced,
  filterCategory,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [exportedData, setExportedData] = useState<TData[] | IContent[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    project_id: false,
    contractor_id: false,
    contract_id: false,
    stage_id: false,
  });
  const [rowSelection, setRowSelection] = useState({});

  const [allProjects, setAllProjects] = useState<MultiSelect[] | undefined>([]);
  const [allContractors, setAllContractors] = useState<
    MultiSelect[] | undefined
  >([]);
  const [allContracts, setAllContracts] = useState<MultiSelect[] | undefined>(
    []
  );
  const [allStages, setAllStages] = useState<MultiSelect[] | undefined>([]);

  const [selectedProjects, setSelectedProjects] = useState<MultiSelect[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<MultiSelect[]>(
    []
  );
  const [selectedContracts, setSelectedContracts] = useState<MultiSelect[]>([]);
  const [selectedStages, setSelectedStages] = useState<MultiSelect[]>([]);

  const supabase = createClient();
  const { userData } = useAuth();

  const table = useReactTable({
    data,
    columns,
    // Handles displaying the data as rows
    getCoreRowModel: getCoreRowModel(),
    // Handles pagination
    getPaginationRowModel: getPaginationRowModel(),
    // Handles sorting functionality
    getSortedRowModel: getSortedRowModel(),
    // Handles sorting functionality
    getFilteredRowModel: getFilteredRowModel(),

    // Setting states for sorting and filter functionalities
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  async function getData() {
    if (!userData) {
      return;
    }

    const [projects, contractors, contracts, stages] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name")
        .eq("team_id", userData.team_id)
        .throwOnError(),
      supabase
        .from("contractors")
        .select("id, name")
        .eq("team_id", userData.team_id)
        .throwOnError(),
      supabase
        .from("contracts")
        .select("id, contract_code")
        .eq("team_id", userData.team_id)
        .throwOnError(),
      supabase
        .from("stages")
        .select("id, name")
        .eq("team_id", userData.team_id)
        .throwOnError(),
    ]);

    const newProjects: MultiSelect[] = [];
    const newContractors: MultiSelect[] = [];
    const newContracts: MultiSelect[] = [];
    const newStages: MultiSelect[] = [];

    projects.data.forEach((item) => {
      newProjects.push({ label: item.name, value: item.id });
    });
    contractors.data.forEach((item) => {
      newContractors.push({ label: item.name, value: item.id });
    });
    contracts.data.forEach((item) => {
      newContracts.push({ label: item.contract_code, value: item.id });
    });
    stages.data.forEach((item) => {
      newStages.push({ label: item.name, value: item.id });
    });

    setAllProjects(newProjects);
    setAllContractors(newContractors);
    setAllContracts(newContracts);
    setAllStages(newStages);
  }

  useEffect(() => {
    getData();
  }, [userData]);

  // WHEN CHECK MARK IS PRESSED, FILTER ROWS BY THE SELECTED ITEMS
  const handleFilter = () => {
    if (
      !selectedProjects.length &&
      !selectedContractors.length &&
      !selectedContracts.length &&
      !selectedStages.length
    ) {
      table.resetColumnFilters();
    }

    const projectIds = selectedProjects.map((p) => p.value);
    const contractorIds = selectedContractors.map((p) => p.value);
    const contractIds = selectedContracts.map((p) => p.value);
    const stageIds = selectedStages.map((p) => p.value);

    table.getColumn("project_id")?.setFilterValue(projectIds);
    table.getColumn("contractor_id")?.setFilterValue(contractorIds);
    table.getColumn("contract_id")?.setFilterValue(contractIds);
    table.getColumn("stage_id")?.setFilterValue(stageIds);
  };

  // RESET ALL VALUES AND SHOW THE FULL DATA
  function onReset() {
    setSelectedProjects([]);
    setSelectedContractors([]);
    setSelectedContracts([]);
    setSelectedStages([]);

    table.resetColumnFilters();
  }

  // EXPORT FILTERED VALUES WHEN EXPORT IS SELECTED
  function getExportData() {
    const data: TData[] = [];

    table.getFilteredRowModel().rows.forEach((item) => {
      data.push(item.original);
    });

    setExportedData(data);
  }

  useEffect(() => {
    getExportData();
  }, [columnFilters, data, sorting]);

  return (
    <div>
      {/*  */}
      <div className="flex lg:justify-end items-center flex-wrap gap-3 mb-5">
        <MultiSelectBar
          name={"projects"}
          array={allProjects}
          selectedArray={selectedProjects}
          setSelectedArray={setSelectedProjects}
        />
        <MultiSelectBar
          name={"contractors"}
          array={allContractors}
          selectedArray={selectedContractors}
          setSelectedArray={setSelectedContractors}
        />
        <MultiSelectBar
          name={"contracts"}
          array={allContracts}
          selectedArray={selectedContracts}
          setSelectedArray={setSelectedContracts}
        />
        <MultiSelectBar
          name={"stages"}
          array={allStages}
          selectedArray={selectedStages}
          setSelectedArray={setSelectedStages}
        />
        <div className="flex items-center gap-2">
          <CheckedButton clickedFn={handleFilter} />
          <Reset clickedFn={onReset} />
        </div>
      </div>
      <div className="mb-5 flex items-end flex-wrap gap-x-4 gap-y-3">
        {/* MULTIPLE SELECT OPTIONS */}

        {/* SEARCH ENGINE */}
        <input
          placeholder={`Filter by ${filterCategory.split("_").join(" ")}`}
          className="searchTable flex-shrink-1 placeholder:text-light70 max-w-sm backdrop-blur-2xl"
          value={
            (table.getColumn(filterCategory)?.getFilterValue() as string) || ""
          }
          onChange={(e) =>
            table.getColumn(filterCategory)?.setFilterValue(e.target.value)
          }
        />

        {/* EXPORT AS CSV BUTTON */}
        {is_export && exportedData.length && data.length ? (
          <Button
            onClick={() =>
              downloadToExcel(is_payment, team_name, exportedData as IContent[])
            }
          >
            Export as CSV
          </Button>
        ) : null}
        {/* COLUMN VISIBILITY DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns
              <ChevronDown className="text-darkText" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {/* table.getHeaderGroups => an array that contains the headers from the "columns" definition */}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {/* Renders the headers accordingly  */}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* TABLE ROW DISPLAY */}

          {/* table.getRowModel => an array containing all the data according to the acc */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION NEXT AND PREVIOUS DISPLAY AND ROW SELECT */}
      {advanced ? (
        <div className="flex justify-between items-end mt-3">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-5">
            <p className="text-[14.5px]">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>

            <div className="flex items-center gap-3 text-[14.5px]">
              {/* PREVIOUS */}
              <button
                className={`${
                  table.getCanPreviousPage()
                    ? "opacity-100 cursor-pointer"
                    : "opacity-50 cursor-default"
                } flex items-center gap-1 duration-300`}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span>
                  <ChevronLeft className="w-4 h-4" />
                </span>
                <span>Previous</span>
              </button>
              {/* NEXT */}
              <button
                className={`${
                  table.getCanNextPage() ? "block" : "opacity-50"
                } flex items-center gap-1 duration-300`}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span>Next</span>
                <span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DataTable;
