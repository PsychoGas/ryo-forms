"use client";

import { useState } from "react";
import { type FormSchema } from "~~/lib/dsl";

interface ExportToCsvProps {
  responses: any[];
  schema: FormSchema;
}

export function ExportToCsv({ responses, schema }: ExportToCsvProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCsv = () => {
    setIsExporting(true);

    try {
      const headers = schema.fields.map((field) => field.label);
      const csvContent = [
        headers.join(","),
        ...responses.map((response) =>
          schema.fields.map((field) => `"${response[field.id]}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${schema.title}_responses.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("An error occurred while exporting the CSV file.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToCsv}
      disabled={isExporting}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exporting...
        </>
      ) : (
        "Export to CSV"
      )}
    </button>
  );
}
