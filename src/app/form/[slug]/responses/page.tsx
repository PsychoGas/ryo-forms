import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "~~/lib/db";
import { forms, formResponses } from "~~/lib/db/schema";
import { FormSchema } from "~~/lib/dsl";
import { Table } from "./table";
import { Chatbot } from "~~/components/chatbot";
import { ExportToCsv } from "~~/app/form/[slug]/responses/export-to-csv";

export default async function FormResponsesPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const lastHyphenIndex = params.slug.lastIndexOf("-");
  const slug = params.slug.slice(0, lastHyphenIndex);
  const urlId = params.slug.slice(lastHyphenIndex + 1);

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.slug, slug), eq(forms.urlId, urlId)),
  });

  if (!form) {
    return notFound();
  }

  const schema = FormSchema.parse(form.schema);

  const responses = await db.query.formResponses.findMany({
    where: eq(formResponses.formId, form.id),
  });

  // Flatten the responses so each row has values for all fields
  const flattenedResponses = responses.map((response) => {
    const data = schema.fields.reduce((acc: any, field) => {
      acc[field.id] = response.data[field.id] ?? "N/A"; // Ensure all fields are included
      return acc;
    }, {});

    return {
      id: response.id,
      ...data, // Add all form field data to the response row
      createdAt: new Date(response.createdAt).toLocaleString(),
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 flex h-screen">
      <div className="w-2/3 pr-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Responses for: {schema.title}</h1>
          <ExportToCsv responses={flattenedResponses} schema={schema} />
        </div>
        <div className="flex-grow overflow-auto">
          <Table responses={flattenedResponses} schema={schema} />
        </div>
      </div>
      <div className="w-1/3 pl-4 flex flex-col">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold mb-4">RYO AI</h2>
        </div>
        <div className="flex-grow overflow-auto rounded-lg border border-gray-300 p-4 bg-white shadow-md">
          <Chatbot responses={flattenedResponses} schema={schema} />
        </div>
      </div>
    </div>
  );
}
