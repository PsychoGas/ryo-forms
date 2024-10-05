"use client";

import { DataTable } from "~~/components/dataTable";
import { usePsy } from "~~/lib/use-psy";

export const Table = ({ responses, schema }: { responses: any; schema: any }) => {
  // Generate columns based on form fields
  const columns = usePsy(schema.fields);

  // Pass the flattened responses to DataTable
  return <DataTable columns={columns} data={responses} />;
};
