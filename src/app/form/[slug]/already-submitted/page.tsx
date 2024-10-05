import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AlreadySubmittedPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-stone-100 text-stone-800">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-6 text-matcha">
          Form Already Submitted
        </h1>
        <p className="text-xl sm:text-2xl text-stone-600 mb-10 font-light max-w-3xl">
          You have already completed this form. Thank you for your submission.
        </p>
        <Link href="/" className="inline-block">
          <button className="px-8 py-3 text-lg font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300">
            <ArrowLeft className="inline-block mr-2" size={20} />
            Return to Home
          </button>
        </Link>
      </main>
    </div>
  );
}
