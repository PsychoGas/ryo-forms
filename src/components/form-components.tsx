"use client";

import { z } from "zod";
import React, { useState } from "react";
import {
  ShortAnswerField,
  LongAnswerField,
  EmailField,
  NumberField,
  MultipleChoiceField,
  MultiSelectField,
  DateField,
} from "~~/lib/dsl";
import { Calendarcomp } from "./ui/calendar";

type FieldProps<T extends z.ZodType<any, any>> = {
  field: z.infer<T>;
  value: any;
  onChange: (value: any) => void;
};

const RequiredStar: React.FC = () => (
  <span className="text-matcha ml-1">*</span>
);

const Label: React.FC<{
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, required, children }) => (
  <label
    htmlFor={htmlFor}
    className="block mb-3 text-lg font-medium text-stone-700 text-left"
  >
    {children}
    {required && <RequiredStar />}
  </label>
);

const inputClasses =
  "w-full px-3 py-2 text-base text-stone-700 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha focus:border-transparent transition duration-300 ease-in-out placeholder-stone-400";

export const ShortAnswerComponent: React.FC<
  FieldProps<typeof ShortAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="text"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const LongAnswerComponent: React.FC<
  FieldProps<typeof LongAnswerField>
> = ({ field, value, onChange }) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <textarea
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={`${inputClasses} h-32 resize-none`}
    />
  </div>
);

export const EmailComponent: React.FC<FieldProps<typeof EmailField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="email"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const NumberComponent: React.FC<FieldProps<typeof NumberField>> = ({
  field,
  value,
  onChange,
}) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <input
      type="number"
      id={field.id}
      name={field.id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      className={inputClasses}
    />
  </div>
);

export const MultipleChoiceComponent: React.FC<
  FieldProps<typeof MultipleChoiceField>
> = ({ field, value, onChange }) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <div className="space-y-2">
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <input
            type="radio"
            id={`${field.id}-${index}`}
            name={field.id}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            required={field.required}
            className="mr-2 text-matcha focus:ring-matcha h-4 w-4 border-stone-300 accent-matcha"
          />
          <span className="text-base text-stone-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export const MultiSelectComponent: React.FC<
  FieldProps<typeof MultiSelectField>
> = ({ field, value, onChange }) => (
  <div className="mb-6">
    <Label htmlFor={field.id} required={field.required}>
      {field.label}
    </Label>
    <div className="space-y-2">
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <input
            type="checkbox"
            id={`${field.id}-${index}`}
            name={field.id}
            value={option}
            checked={value?.includes(option)}
            onChange={(e) => {
              const newValue = e.target.checked
                ? [...(value || []), option]
                : (value || []).filter((v: string) => v !== option);
              onChange(newValue);
            }}
            className="mr-2 text-matcha focus:ring-matcha h-4 w-4 rounded border-stone-300 accent-matcha"
          />
          <span className="text-base text-stone-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export const DateComponent: React.FC<FieldProps<typeof DateField>> = ({
  field,
  value,
  onChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date: Date) => {
    // Adjust the date to local timezone and format it
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];
    onChange(formattedDate);
    setShowCalendar(false);
  };

  return (
    <div className="mb-6 relative">
      <Label htmlFor={field.id} required={field.required}>
        {field.label}
      </Label>
      <input
        type="text"
        id={field.id}
        name={field.id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        className={inputClasses}
        onClick={() => setShowCalendar(true)}
        readOnly
      />
      {showCalendar && (
        <div className="absolute z-10 mt-1">
          <Calendarcomp
            onSelect={handleDateSelect}
            selectedDate={value ? new Date(value) : undefined}
          />
        </div>
      )}
    </div>
  );
};
