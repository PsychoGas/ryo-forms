import { z } from "zod";

export const Condition = z
  .object({
    field: z.string().describe("The field that this condition depends on"),
    value: z
      .string()
      .describe(
        "The value that the field must have for this condition to be true"
      ),
  })
  .describe("Condition for field visibility");

export const BaseField = z
  .object({
    id: z.string().describe("Unique identifier for the field"),
    type: z.string().describe("Type of the field"),
    required: z
      .boolean()
      .default(true)
      .describe("Whether the field is required"),
    condition: Condition.optional().describe("Condition for field visibility"),
  })
  .describe("Base field schema");

export const ShortAnswerField = BaseField.extend({
  type: z.literal("shortAnswer").describe("Field type: shortAnswer"),
  label: z.string().describe("Label for the short answer field"),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the short answer field"),
}).describe("Short answer field schema");

export const LongAnswerField = BaseField.extend({
  type: z.literal("longAnswer").describe("Field type: longAnswer"),
  label: z.string().describe("Label for the long answer field"),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the long answer field"),
}).describe("Long answer field schema");

export const EmailField = BaseField.extend({
  type: z.literal("email").describe("Field type: email"),
  label: z.string().describe("Label for the email field"),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the email field"),
}).describe("Email field schema");

export const NumberField = BaseField.extend({
  type: z.literal("number").describe("Field type: number"),
  label: z.string().describe("Label for the number field"),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the number field"),
}).describe("Number field schema");

export const MultipleChoiceField = BaseField.extend({
  type: z.literal("multipleChoice").describe("Field type: multipleChoice"),
  label: z.string().describe("Label for the multiple choice field"),
  options: z
    .array(z.string())
    .describe("Options for the multiple choice field"),
}).describe("Multiple choice field schema");

export const MultiSelectField = BaseField.extend({
  type: z.literal("multiSelect").describe("Field type: multiSelect"),
  label: z.string().describe("Label for the multi-select field"),
  options: z.array(z.string()).describe("Options for the multi-select field"),
}).describe("Multi-select field schema");

// Add this new field type after the existing field definitions
export const DateField = BaseField.extend({
  type: z.literal("date").describe("Field type: date"),
  label: z.string().describe("Label for the date field"),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the date field"),
}).describe("Date field schema");

export const Field = z
  .union([
    ShortAnswerField,
    LongAnswerField,
    EmailField,
    NumberField,
    MultipleChoiceField,
    MultiSelectField,
    DateField,
  ])
  .describe("Union of all possible field types");

export const FormSchema = z
  .object({
    title: z.string().describe("Title of the form"),
    fields: z.array(Field).describe("Array of fields in the form"),
  })
  .describe("Form schema");

export type FormSchema = z.infer<typeof FormSchema>;