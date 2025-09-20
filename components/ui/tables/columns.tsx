"use client";

import {
  Amount,
  Contract,
  Contractor,
  Payment,
  ProjectReport,
  User,
} from "@/types/types";
import {
  checkArray,
  convertCurrency,
  formatCurrency,
  totalSum,
} from "@/utils/currencies";
import { formatDate } from "@/utils/dateAndTime";
import { ColumnDef } from "@tanstack/react-table";
import Banner from "../Banner";
import { Checkbox } from "../checkbox";

import { ArrowUpDown } from "lucide-react";
import OnlineStatus from "../OnlineStatus";
import UserAction from "./UserAction";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { getInitials } from "@/utils/initials";
import ContractAction from "./ContractAction";
import PaymentAction from "./PaymentAction";
import ContractorAction from "./ContractorAction";

// CONTRACT DATA COLUMN
export const contractColumns: ColumnDef<Contract>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    accessorKey: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contract code
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "contract_code",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_completed",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_completed");

      return <Banner text={status ? "completed" : "ongoing"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: string = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");

      return (
        <div className="">
          {desc.length > 40 ? desc.slice(0, 41) + "..." : desc}
        </div>
      );
    },
  },
  {
    header: () => {
      return (
        <div className="flex justify-end">
          <div>Amount</div>
        </div>
      );
    },
    accessorKey: "contract_amounts",
    cell: ({ row }) => {
      const currencies: Amount[] = row.getValue("contract_amounts");

      return (
        <div className="text-right">
          {currencies[0]?.amount && currencies[0]?.amount !== "Unlimited"
            ? formatCurrency(+currencies[0]?.amount, currencies[0]?.code)
            : `${currencies[0]?.symbol} Unlimited`}
          {currencies?.length > 1 ? ", ..." : ""}
        </div>
      );
    },
  },
  // HIDDEN COLUMNS FOR FILTERING
  {
    accessorKey: "project_id",
    header: "Project",
    enableHiding: false, // can hide
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "contractor_id",
    header: "Contractor",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "contract_id",
    header: "Contract",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;

      // ACTUALLY FILTER BY THE ID
      return filterValues.includes(row.getValue("id"));
    },
  },
  {
    accessorKey: "stage_id",
    header: "Stage",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;

      return <ContractAction data={contract} />;
    },
  },
];

// PAYMENT DATA COLUMN
export const paymentColumns: ColumnDef<Payment>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    accessorKey: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contract code
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorFn: (row) => (row?.contracts ? row?.contracts?.contract_code : ""),
    // id: "contract_code",
    accessorKey: "contracts",
    cell: ({ row }) => {
      const data = row.original;

      return <div className="">{data?.contracts?.contract_code ?? "--"}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const contract = row.original;

      const checkPaid = contract.is_paid ? "paid" : "unpaid";

      return <Banner text={contract.is_completed ? checkPaid : "pending"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "date",
    cell: ({ row }) => {
      const date: string = row.getValue("date");

      return <div className="">{formatDate(date)}</div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");

      return (
        <div className="">
          {desc.length > 40 ? desc.substring(0, 41) + "..." : desc}{" "}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Amount
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorFn: (row) =>
      row?.payment_amounts ? row?.payment_amounts[0]?.name : "",
    id: "currency",
    filterFn: (row, columnId, filterValue: string) => {
      const names = row.original.payment_amounts?.map((a: any) => a.name) ?? [];
      return names.some((name: string) =>
        name.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="text-right">
          {data?.payment_amounts &&
          data?.payment_amounts[0]?.amount &&
          data?.payment_amounts[0]?.amount !== "Unlimited"
            ? formatCurrency(
                +data?.payment_amounts[0]?.amount,
                data?.payment_amounts[0]?.code
              )
            : `${
                data?.payment_amounts && data?.payment_amounts[0]?.symbol
              } Unlimited`}
          {data?.payment_amounts && data?.payment_amounts?.length > 1
            ? ", ..."
            : ""}
        </div>
      );
    },
  },

  // HIDDEN COLUMNS FOR FILTERING
  {
    accessorKey: "project_id",
    header: "Project",
    enableHiding: false, // can hide
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "contractor_id",
    header: "Contractor",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "contract_id",
    header: "Contract",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "stage_id",
    header: "Stage",
    enableHiding: false,
    filterFn: (row, columnId, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(columnId));
    },
  },

  // ACTIONS DROPDOWN MENU
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-around">
          {/* IF PAYMENT HAS A CONTRACT ID, GIVE A SLIGHTLY DIFFERENT EDIT DIALOG */}
          <PaymentAction data={payment} is_contract={!!payment?.contract_id} />
        </div>
      );
    },
  },
];

// PAYMENT DATA COLUMN
export const contractorColumns: ColumnDef<Contractor>[] = [
  {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    accessorKey: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Project
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorFn: (row) => (row?.projects ? row?.projects?.name : ""),
    id: "project",
    cell: ({ row }) => {
      const contractor = row.original;
      const project = checkArray(contractor?.projects);

      return (
        <div>
          {project.name > 20 ? project.name.slice(0, 15) + "..." : project.name}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const contractor = row.original;

      return (
        <Banner text={contractor.is_available ? "ongoing" : "unavailable"} />
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Location
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "country",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Description
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "description",
    cell: ({ row }) => {
      const desc: string = row.getValue("description");

      return (
        <div className="">
          {desc.length > 40 ? desc.substring(0, 41) + "..." : desc}{" "}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Contracts
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorFn: (row) => (row?.contracts ? row?.contracts?.length : ""),
    id: "contracts",
    cell: ({ row }) => {
      const contractor = row.original;
      const data = contractor?.contracts;

      return <div className="">{data?.length} </div>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Payments
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorFn: (row) => (row?.payments ? row?.payments?.length : ""),
    id: "payments",
    cell: ({ row }) => {
      const contractor = row.original;
      const data = contractor.payments;

      const filter = data ? data?.filter(item => item.is_paid) : []

      return <div className="">{filter.length}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex justify-around">
          
          <ContractorAction data={data} />
        </div>
      );
    },
  },
];

// TEAMS DATA COLUMN
export const teamColumns: ColumnDef<User>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "full_name",
    cell: ({ row }) => {
      const user: User = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user?.image_url ?? ""}
              alt={`${user?.first_name}'s avatar`}
            />
            <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <div>{user?.full_name}</div>
            <div className="-mt-1 text-[13px] text-light70">
              {user?.job_title ?? "Unemployed"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "is_online",
    cell: ({ row }) => {
      const status: boolean = row.getValue("is_online");

      return <OnlineStatus status={status ? "online" : "offline"} />;
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Email
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "email",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Role
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "role",
    cell: ({ row }) => {
      const user = row.original;

      return user?.is_owner ? (
        <div className="flex items-center gap-1 text-[14px]">
          <div className="py-1 px-3 border border-lightText bg-darkText rounded-full capitalize">
            owner
          </div>
          <div className="py-1 px-3 border border-lightText rounded-full capitalize">
            {user.role}
          </div>
        </div>
      ) : (
        <div className="text-[14px] py-1 px-3 border border-lightText rounded-full">
          {user.role}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Hire Type
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "hire_type",
    cell: ({ row }) => {
      const type: string = row.getValue("hire_type");

      return <div className="capitalize">{type}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;

      return team?.is_owner ? <UserAction data={team} /> : null;
    },
  },
];

export const projectReportColumns: ColumnDef<ProjectReport>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Project Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            No. of Contracts
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "total_contracts",
    // cell: ({ row }) => {

    // },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            No. of Payments
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "total_payments",
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Total contract sum
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "contracts",
    cell: ({ row }) => {
      const contracts: Contract[] = row.getValue("contracts");
      console.log(contracts);

      // return <div>{convertCurrency(totalSum(contracts.map(item => item.currency_amount !== "Unlimited" ? item.currency_amount : 0)))}</div>
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="">
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            Total expenses
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      );
    },
    accessorKey: "expenses",
    cell: ({ row }) => {
      const expenses: Payment[] = row.getValue("expenses");
      console.log(expenses);
      // return <div>{convertCurrency(totalSum(expenses.map(item => item.currency_amount !== "Unlimited" ? item.currency_amount : 0)))}</div>
    },
  },
];
