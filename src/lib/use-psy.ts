"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

// Generate columns dynamically based on the form schema fields
export const usePsy = (fields: any[]) => {
  return useMemo(
    () =>
      fields.map((field) => ({
        accessorKey: field.id, // This accesses the field by its ID
        header: field.label, // Label for the table header
        cell: ({ row }: { row: any }) => row.original[field.id] ?? "N/A", // Dynamically access each field's value
      })),
    [fields]
  );
};
