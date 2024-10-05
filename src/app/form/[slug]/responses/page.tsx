import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "~~/lib/db";
import { forms, formResponses } from "~~/lib/db/schema";
import { FormSchema } from "~~/lib/dsl";
import { ResponsesContent } from "./responses-content"; // Make sure this path is correct

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
    <ResponsesContent initialResponses={flattenedResponses} schema={schema} />
  );
}