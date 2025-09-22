"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "../button";
import { CircleAlert, Download } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../shadcn-io/dropzone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import { ContractorSchema, PaymentSchema } from "@/zod/validation";
import Paragraph from "@/components/fontsize/Paragraph";
import Submit from "./Submit";
import BulkAddHoverCard from "../cards/BulkAddHoverCard";

type BulkAddProps = {
  //   readonly children: React.ReactNode;
  readonly setItems: React.Dispatch<
    React.SetStateAction<Record<string, string>[]>
  >;
  readonly items: Record<string, string>[];
  readonly headers: string[];
  readonly setHeaders: React.Dispatch<React.SetStateAction<string[]>>;
  readonly title: string;
  readonly desc: string;
  readonly className?: string;
  readonly setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  readonly open?: boolean;
  readonly loading: boolean;
  readonly handleSubmit: () => void;
  readonly mode: string;
};

function BulkAdd({
  title,
  desc,
  className,
  setOpen,
  setItems,
  items,
  open,
  mode,
  headers,
  setHeaders,
  loading,
  handleSubmit,
}: BulkAddProps) {
  const { userData } = useAuth();

  const [files, setFiles] = useState<File[] | undefined>();
  const [skipped, setSkipped] = useState(0);

  const validateRows = (rows: Record<string, string>[]) => {
    const schema =
      mode.toLowerCase() === "contractor" ? ContractorSchema : PaymentSchema;
    const validRows: Record<string, string>[] = [];
    let skipped = 0;

    rows.forEach((row) => {
      const result = schema.safeParse(row);
      if (result.success) {
        validRows.push(result.data as unknown as Record<string, string>);
      } else {
        skipped++;
      }
    });

    return { validRows, skipped };
  };

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    const file = files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    const handleParsed = (rows: Record<string, string>[]) => {
      const headers = Object.keys(rows[0] || {});
      const { validRows, skipped } = validateRows(rows);
      setHeaders(headers);
      setItems(validRows);
      setSkipped(skipped);
    };

    if (fileExtension === "csv") {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleParsed(results.data as Record<string, string>[]);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      // Parse Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
          defval: "",
        });
        handleParsed(rows);
      };

      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Unsupported file type. Please upload CSV or Excel.");
    }
  };

  const requirements = {
    contractor: [
      {
        schema: "name",
        type: "text",
        description: "Full contractor's name",
        validation: "Must be more than 1 character",
        dummy: "Wares Technical",
        dummy2: "Gemini Limited",
      },
      {
        schema: "city",
        type: "text",
        description: "The city location of contractor",
        validation: "Not required",
        dummy: "",
        dummy2: "Rio",
      },
      {
        schema: "country",
        type: "text",
        description: "The country location of contractor",
        validation: "Must be more than 1 character",
        dummy: "United States",
        dummy2: "Brazil",
      },
      {
        schema: "description",
        type: "text",
        description: "Contractor's purpose in project",
        validation: "Must be more than 1 character",
        dummy: "Ensures the safety of wall fixtures",
        dummy2: "Oversees the architectural designs",
      },
      {
        schema: "start_month",
        type: "text",
        description: "Month contractor started with project",
        validation: "The full written month",
        dummy: "August",
        dummy2: "September",
      },
      {
        schema: "start_year",
        type: "number",
        description: "Year contractor started with project",
        validation: `Greater than 1960 & less than or equal to ${new Date().getFullYear()}`,
        dummy: "2013",
        dummy2: "2024",
      },
      {
        schema: "relevance",
        type: "float",
        description: "Level of importance contractor is to project",
        validation: "Whole or decimal number from 0 to 5",
        dummy: "3",
        dummy2: "4.5",
      },
      {
        schema: "comment",
        type: "text",
        description: "Additional info",
        validation: "Not required",
        dummy: "Expecting a zoom call next Tuesday",
        dummy2: "",
      },
    ],
    payment: [
      {
        schema: "",
        type: "",
        description: "Additional info",
        validation: "Not required",
        dummy: "Expecting a zoom call next Tuesday",
        dummy2: "",
      },
    ],
  };

  function switchRequirements() {
    if (mode.toLowerCase() === "contractor") {
      return requirements.contractor;
    } else if (mode.toLowerCase() === "payment") {
      return requirements.payment;
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={`${
            userData?.role === "admin" ? "flex" : "hidden"
          } ${className}`}
          variant={"secondary"}
        >
          <Download />
          <span className="hidden sm:block">Bulk Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import {title} </DialogTitle>
          <DialogDescription className="">{desc}</DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <div className="flex items-center">
            <Paragraph text="Requirements" className="text-darkText" />
            <BulkAddHoverCard
              mode={mode}
              requirements={switchRequirements() ?? []}
            />
          </div>
          {/* DRAG AND DROP OR UPLOAD FILE */}
          <Dropzone
            accept={{
              ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel":
                [],
            }}
            maxFiles={1}
            maxSize={1024 * 1024 * 5}
            minSize={1024 * 0}
            onDrop={handleFileUpload}
            onError={(error) => toast.error(error.message)}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
          {skipped > 0 && (
            <div className="flex items-center gap-1 mb-2 mt-1 text-red-600">
              <CircleAlert strokeWidth={1.2} className="w-4 h-4" />
              <Paragraph
                text={`${skipped} row(s) were skipped due to validation
              errors.`}
                className=""
              />
            </div>
          )}
          {headers.length && items.length ? (
            <div className="mt-4">
              <div className="mb-1">
                <Header6 text="Preview" className="text-darkText/80" />
              </div>
              <div className="w-full overflow-auto h-[20vh]">
                <Table className=" text-darkText/65">
                  <TableHeader className="">
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead
                          key={header}
                          className="px-2 py-1 font-medium capitalize text-darkText/80"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.slice(0, 10).map((row, i) => (
                      <TableRow key={i + 1}>
                        {headers.map((header) => (
                          <TableCell key={header} className="px-2 py-1.5">
                            {row[header]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {items.length > 10 ? (
                      <TableRow className="justify-center">
                        <TableCell className="text-sm">
                          {items.length - 10} more row
                          {optionalS(items.length - 10)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
              <Submit
                buttonClick={handleSubmit}
                loading={loading}
                disabledLogic={loading}
              />
            </div>
          ) : (
            <div className="mt-4">
              <Paragraph text="Example" className="text-darkText" />

              <div className="flex scrollHorizontal overflow-x-auto mt-1 border border-darkText/10">
                {mode.toLowerCase() === "contractor"
                  ? requirements.contractor.map((item) => {
                      return (
                        <div key={item.schema}>
                          <div className="flex items-center px-2 h-8 min-w-28 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30">
                            <Paragraph
                              text={item.schema}
                              className="whitespace-nowrap font-medium text-darkText/80"
                            />
                          </div>
                          <div className="flex items-center px-2 h-8 min-w-28 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30">
                            <Paragraph
                              text={item.dummy}
                              className="whitespace-nowrap text-darkText/75"
                            />
                          </div>
                          <div className="flex items-center px-2 h-8 min-w-28 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30">
                            <Paragraph
                              text={item.dummy2}
                              className="whitespace-nowrap text-darkText/75"
                            />
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BulkAdd;
