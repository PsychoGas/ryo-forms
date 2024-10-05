"use client";

import React, { useState, useEffect, Fragment } from "react";
import { z } from "zod";
import { FormSchema } from "~~/lib/dsl";
import { generateShortId } from "~~/lib/utils";
import {
  ShortAnswerComponent,
  LongAnswerComponent,
  EmailComponent,
  NumberComponent,
  MultipleChoiceComponent,
  MultiSelectComponent,
  DateComponent,
} from "./form-components";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type FormData = Record<string, any>;

const DynamicForm: React.FC<{
  formId: number;
  schema: z.infer<typeof FormSchema>;
  slug: string;
}> = ({ formId, schema, slug }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if there's an existing submission ID in localStorage
    const storedSubmissionId = localStorage.getItem(
      `form_${formId}_submission`
    );
    if (storedSubmissionId) {
      setSubmissionId(storedSubmissionId);
      setIsSubmitted(true);
    } else {
      // Generate a new submission ID
      const newSubmissionId = generateShortId();
      setSubmissionId(newSubmissionId);
    }

    // Initialize form data with default values
    const initialData: FormData = {};
    schema.fields.forEach((field) => {
      if (field.type === "multiSelect") {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = "";
      }
    });
    setFormData(initialData);
  }, [schema, formId]);

  const handleChange = (fieldId: string, value: any) => {
    if (!isSubmitted) {
      setFormData((prevData) => ({ ...prevData, [fieldId]: value }));
    }
  };

  const isFieldVisible = (
    field: z.infer<typeof FormSchema>["fields"][number]
  ): boolean => {
    if (!field.condition) return true;
    return formData[field.condition.field] === field.condition.value;
  };

  const renderField = (
    field: z.infer<typeof FormSchema>["fields"][number],
    value: any,
    onChange: (value: any) => void
  ) => {
    if (!isFieldVisible(field)) return null;

    const commonProps = {
      field,
      value,
      onChange,
      disabled: isSubmitted,
    };

    switch (field.type) {
      case "shortAnswer":
        // @ts-expect-error: Type mismatch in field props
        return <ShortAnswerComponent {...commonProps} />;
      case "longAnswer":
        // @ts-expect-error: Type mismatch in field props
        return <LongAnswerComponent {...commonProps} />;
      case "email":
        // @ts-expect-error: Type mismatch in field props
        return <EmailComponent {...commonProps} />;
      case "number":
        // @ts-expect-error: Type mismatch in field props
        return <NumberComponent {...commonProps} />;
      case "multipleChoice":
        // @ts-expect-error: Type mismatch in field props
        return <MultipleChoiceComponent {...commonProps} />;
      case "multiSelect":
        // @ts-expect-error: Type mismatch in field props
        return <MultiSelectComponent {...commonProps} />;
      case "date":
        return (
          <DateComponent field={field} value={value} onChange={onChange} />
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId || isSubmitted) return;

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId, data: formData, submissionId }),
      });
      if (response.status === 200) {
        console.log("Form submitted successfully");
        localStorage.setItem(`form_${formId}_submission`, submissionId);
        setIsSubmitted(true);
      } else if (response.status === 409) {
        console.error("Form has already been submitted");
        setIsSubmitted(true);
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 text-left">
      {schema.fields.map((field) => (
        <Fragment key={field.id}>
          {renderField(field, formData[field.id], (value: any) =>
            handleChange(field.id, value)
          )}
        </Fragment>
      ))}
      <button
        type="submit"
        disabled={isSubmitted}
        className={`px-4 py-2 text-base font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300 flex items-center justify-center ${
          isSubmitted ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitted ? "Submitted" : "Submit Form"}
        <ArrowRight className="inline-block ml-2" size={20} />
      </button>
    </form>
  );
};

export default DynamicForm;
