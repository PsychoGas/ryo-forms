"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-3 text-lg font-light text-stone-100 bg-matcha rounded-xl hover:bg-[#3E4A46] transition-all duration-300 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        "Creating..."
      ) : (
        <>
          Create Form <ArrowRight className="inline-block ml-2" size={20} />
        </>
      )}
    </button>
  );
};
