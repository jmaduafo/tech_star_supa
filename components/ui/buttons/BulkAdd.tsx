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
import Header6 from "@/components/fontsize/Header6";
import { ContractorFileSchema, PaymentSchema } from "@/zod/validation";
import Paragraph from "@/components/fontsize/Paragraph";
import Submit from "./Submit";
import BulkAddHoverCard from "../cards/BulkAddHoverCard";
import { optionalS } from "@/utils/optionalS";

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
  const [skipped, setSkipped] = useState<any[]>([]);

  const [hoverOpen, setHoverOpen] = useState(false);

  const validateRows = (rows: Record<string, string>[], headers: string[]) => {
    const schema =
      mode.toLowerCase() === "contractor"
        ? ContractorFileSchema
        : PaymentSchema;
    const validRows: Record<string, string>[] = [];
    const invalidRows: any[] = [];

    rows.forEach((row, i) => {
      const result = schema.safeParse(row);
      if (result.success) {
        validRows.push(result.data as unknown as Record<string, string>);
      } else {
        invalidRows.push({
          error: result.error.issues[0].message,
          row: i + 2,
        });
      }
    });

    return { validRows, invalidRows };
  };

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    const file = files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    const handleParsed = (rows: Record<string, string>[]) => {
      const headers = Object.keys(rows[0] || {});
      const { validRows, invalidRows } = validateRows(rows, headers);
      setHeaders(headers);
      setItems(validRows);
      setSkipped(invalidRows);
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
        dummy2: "september",
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
        schema: "is_available",
        type: "boolean",
        description: "Notes if contractor is involved in project",
        validation: "Must be TRUE or FALSE",
        dummy: "TRUE",
        dummy2: "FALSE",
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

  function showBool(value: string) {
    if (typeof value === "boolean") {
      if (value === true) {
        return "TRUE";
      } else {
        return "FALSE";
      }
    } else {
      return value;
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
              open={hoverOpen}
              setOpen={setHoverOpen}
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
          {skipped.length > 0 && (
            <div className="flex flex-col gap-1 mb-2 mt-1 text-red-600">
              {skipped.slice(0, 3).map((item, i) => {
                return (
                  <div key={i + 1} className="flex gap-2 items-center">
                    <CircleAlert strokeWidth={1.2} className="w-4 h-4" />
                    <Paragraph
                      text={`${item.error} at row ${item.row}`}
                      className=""
                    />
                  </div>
                );
              })}
              {skipped.length - 3 > 0 && (
                <Paragraph
                  text={`... ${skipped.length - 3} more errors`}
                  className=""
                />
              )}
            </div>
          )}
          {headers.length && items.length && items.length <= 50 ? (
            <div className="mt-4">
              <div className="mb-1">
                <Header6 text="Preview" className="text-darkText/80" />
              </div>
              <div className="relative scrollHorizontal overflow-x-auto mt-1 border border-darkText/10">
                <div className="flex">
                  {headers.map((header) => {
                    return (
                      <div key={header}>
                        <div className="flex items-center px-2 h-8 min-w-28 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30">
                          <Paragraph
                            text={header}
                            className="whitespace-nowrap font-medium text-darkText/80"
                          />
                        </div>
                        {items.slice(0, 10).map((row, i) => (
                          <div
                            key={i + 1}
                            className=" flex items-center px-2 h-8 min-w-28 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30"
                          >
                            <Paragraph
                              text={showBool(row[header])}
                              className="whitespace-nowrap text-darkText/75"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                {items.length > 10 && items.length <= 50 ? (
                  <div className="sticky left-0">
                    <div className="flex items-center px-2 h-8 border-t border-r border-r-darkText/20 border-t-darkText/20 bg-lightText/30">
                      <Paragraph
                        text={`${items.length - 10} more row${optionalS(
                          items.length - 10
                        )}`}
                        className="whitespace-nowrap text-darkText/75"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              {items.length <= 50 ? (
                <div className="flex justify-end mt-4">
                  <Submit
                    buttonClick={handleSubmit}
                    loading={loading}
                    disabledLogic={loading}
                  />
                </div>
              ) : null}
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
