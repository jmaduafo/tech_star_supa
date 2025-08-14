import xlsx, { IContent, IJsonSheet } from "json-as-xlsx";
import { formatDate } from "./dateAndTime";
import { TimeStamp } from "@/types/types";

export function downloadToExcel(
  payment: boolean,
  team_name: string,
  data: IContent[]
) {
  let columns: IJsonSheet[] = [
    {
      sheet: payment ? "Payments Table" : "Contracts Table",
      columns: [
        { label: "ID", value: "id" }, // Top level data
        {
          label: "CONTRACT?",
          value: (row) => (row.is_contract ? "Yes" : "No"),
        },
        { label: "CONTRACT CODE", value: (row) => row.contract_code ?? "--" },
        { label: "DATE", value: (row) => formatDate(row.date as TimeStamp) },
        { label: "DESCRIPTION", value: "description" },
        { label: "PROJECT NAME", value: "project_name" },
        { label: "CONTRACTOR NAME", value: "contractor_name" },
        { label: "STAGE", value: "stage_name" },
        {
          label: "BANK NAME",
          value: (row) =>
            row.bank_name && typeof row.bank_name === "string"
              ? row.bank_name.charAt(0).toUpperCase() + row.bank_name.slice(1)
              : "",
        },
        {
          label: "CURRENCY NAME",
          value: "currency_name",
        },
        {
          label: "CURRENCY CODE",
          value: "currency_code",
        },
        {
          label: "CURRENCY SYMBOL",
          value: "currency_symbol",
        },
        {
          label: "CURRENCY AMOUNT",
          value: "currency_amount"
        },
        {
          label: "STATUS",
          value: (row) =>
            row.is_completed && payment
              ? "Paid"
              : !row.is_completed && payment
              ? "Pending"
              : row.is_completed && !payment
              ? "Completed"
              : "Ongoing",
        },
        {
          label: "UPDATED AT",
          value: (row) =>
            row.updated_at ? formatDate(row.updated_at as TimeStamp) : "",
        },
        {
          label: "COMMENT",
          value: (row) => row.comment ?? "",
        },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: team_name + " Spreadsheet", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  };

  xlsx(columns, settings);
}
