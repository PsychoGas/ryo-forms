import { notFound } from "next/navigation";
import { FormSchema } from "~~/lib/dsl";
import DynamicForm from "~~/components/dynamic-form";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { eq, and } from "drizzle-orm";
import { forms } from "~~/lib/db/schema";
import { ArrowRight } from "lucide-react";

export default async function FormPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = auth();

  // Find the last hyphen in the slug
  const lastHyphenIndex = params.slug.lastIndexOf("-");

  // Extract the slug and urlId
  const slug = params.slug.slice(0, lastHyphenIndex);
  const urlId = params.slug.slice(lastHyphenIndex + 1);

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.slug, slug), eq(forms.urlId, urlId)),
  });

  if (!form) {
    return notFound();
  }

  const schema = FormSchema.parse(form.schema);

  const isCreator = userId === form.userId;
  console.log(isCreator);
  console.log(form.userId);
  console.log(userId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-stone-100 text-stone-800">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-6 text-matcha">
          {schema.title}
        </h1>

        {isCreator && (
          <Link
            href={`/form/${params.slug}/responses`}
            className="px-4 py-2 text-base font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300 mb-10"
          >
            View Responses{" "}
            <ArrowRight className="inline-block ml-2" size={20} />
          </Link>
        )}

        <div className="w-full max-w-3xl bg-stone-50 p-8 border border-stone-200 rounded-md">
          <DynamicForm slug={params.slug} formId={form.id} schema={schema} />
        </div>
      </main>
    </div>
  );
}
