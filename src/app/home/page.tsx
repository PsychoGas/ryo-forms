import { redirect } from "next/navigation";
import { z } from "zod";
import { generateForm } from "~~/lib/ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "~~/lib/db";
import { forms } from "~~/lib/db/schema";
import { generateShortId } from "~~/lib/utils";
import { SubmitButton } from "./submit-button";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Logo } from "~~/components/logo";

export default async function HomePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's recent forms
  const recentForms = await db
    .select({
      id: forms.id,
      slug: forms.slug,
      urlId: forms.urlId,
      createdAt: forms.createdAt,
      schema: forms.schema,
    })
    .from(forms)
    .where(eq(forms.userId, userId))
    .orderBy(desc(forms.createdAt))
    .limit(6);

  async function createForm(formData: FormData) {
    "use server";

    const input = formData.get("input");
    const { userId } = auth();
    if (!userId) {
      throw new Error("User not found");
    }

    const result = z.string().parse(input);

    const form = await generateForm(result);

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const urlId = generateShortId();
    const fullSlug = `${slug}-${urlId}`;

    const createdForm = await db
      .insert(forms)
      .values({
        userId: userId,
        schema: JSON.stringify(form),
        slug: slug,
        urlId: urlId,
      })
      .returning({ id: forms.id });

    redirect(`/form/${fullSlug}`);
  }

  // Get the current time of day
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 w-screen h-screen bg-stone-50 max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-light tracking-tight mb-6 text-matcha">
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6" /> Craft Your Form
        </div>
      </h2>
      <p className="text-lg text-stone-600 mb-6 font-light">
        Describe your form, and let our AI transform your vision into reality.
      </p>

      <form action={createForm} className="w-full space-y-4">
        <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm hover:border-matcha transition-all duration-300">
          <textarea
            id="input"
            name="input"
            placeholder="A survey form titled 'Survey' with a required name field, a required 'Do you have a pet?' radio button with 'Yes' and 'No' options, and a required 'What is your pet's name?' text field that only shows if 'Yes' is selected."
            className="w-full px-3 py-2 text-stone-700 bg-transparent border-b border-stone-300 focus:border-matcha focus:outline-none transition duration-200 ease-in-out h-32 resize-none font-light text-sm rounded-xl"
            required
          />
        </div>
        <SubmitButton />
      </form>

      <div className="mt-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-light text-matcha">Your recent forms</h3>
          <Link
            href="/forms"
            className="text-stone-600 hover:text-matcha transition-colors duration-200 text-sm"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentForms.map((form) => (
            <Link
              key={form.id}
              href={`/form/${form.slug}-${form.urlId}/responses`}
              className="p-6 bg-white border border-stone-200 rounded-2xl hover:border-matcha hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full"
            >
              <h4 className="font-medium text-lg text-stone-800">
                {/* @ts-ignore */}
                {form.schema.title || "Untitled Form"}
              </h4>
              <p className="text-sm text-stone-500 mt-2">
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
