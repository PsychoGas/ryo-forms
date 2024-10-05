import { NextResponse } from "next/server";
import { db } from "~~/lib/db";
import { formResponses, formSubmissions } from "~~/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { formId, data, submissionId } = await req.json();
  try {
    // Check if this submission ID has been used before
    const existingSubmission = await db.query.formSubmissions.findFirst({
      where: and(
        eq(formSubmissions.formId, formId),
        eq(formSubmissions.submissionId, submissionId)
      ),
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Form has already been submitted" },
        { status: 409 }
      );
    }

    // If not, proceed with saving the response and recording the submission
    const formResponse = await db.transaction(async (tx) => {
      const response = await tx
        .insert(formResponses)
        .values({
          formId,
          data: JSON.stringify(data),
        })
        .returning({ id: formResponses.id });

      await tx.insert(formSubmissions).values({
        formId,
        submissionId,
        responseId: response[0].id,
      });

      return response[0];
    });

    return NextResponse.json({
      status: 200,
      success: true,
      id: formResponse.id,
    });
  } catch (error) {
    console.error("Error saving form response:", error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
