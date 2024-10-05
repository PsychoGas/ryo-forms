"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendarcomp } from "./calendar";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({ children, onClick, className, ref }: ButtonProps) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={
        className
          ? cn(
              "px-24 py-2 rounded-md border border-[#505F5A] text-white bg-[#505F5A] hover:bg-[#505F5A] hover:text-white",
              className
            )
          : "px-4 py-2 rounded-md border border-[#505F5A] text-white bg-[#505F5A] hover:bg-[#505F5A] hover:text-white"
      }
    >
      {children}
    </button>
  );
}

interface CalendarButtonProps {
  date: Date | undefined;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

function CalendarButton({ date, onClick, ref }: CalendarButtonProps) {
  return (
    <Button ref={ref} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <CalendarIcon className="mr-2 h-4 w-4 text-white" />
        {date ? (
          <span className="text-white">{format(date, "PPP")}</span>
        ) : (
          <span className="text-white">Pick a date</span>
        )}
      </div>
    </Button>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
}

function PopoverTrigger({ children }: PopoverTriggerProps) {
  return (
    <div className="flex justify-center items-center h-screen bg-rgb(245 245 244)">
      {children}
    </div>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
}

function PopoverContent({ children }: PopoverContentProps) {
  return (
    <div className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      {children}
    </div>
  );
}

interface CalendarProps {
  onSelect: (date: Date) => void;
  onClose: () => void;
}

function Calendar({ onSelect, onClose }: CalendarProps) {
  return (
    <div className="bg-white p-4">
      <Calendarcomp
        onSelect={(newDate) => {
          onSelect(newDate);
          onClose();
        }}
      />
    </div>
  );
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PopoverTrigger>
      <CalendarButton
        date={date}
        onClick={() => setOpen(true)}
        ref={anchorRef}
      />
      {open && (
        <div style={{ position: "absolute", top: "420px", left: 600 }}>
          <Calendar
            onSelect={(newDate) => setDate(newDate)}
            onClose={handleClose}
          />
        </div>
      )}
    </PopoverTrigger>
  );
}
