import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "~~/components/logo";
import {BoxReveal} from "~~/components/ui/box-reveal"
import {ConfettiButton} from "~~/components/ui/confetti"
import ShineBorder from "~~/components/ui/shine-border"
const features = [
  {
    title: (
      
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Effortless Creation
        </span>
      
    ),
    description:
      "Create forms effortlessly with AI. Transform ideas into user-friendly designs instantly, streamlining the form-building process.",
  },
  {
    title: (
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Seamless Refinement
        </span>
      
    ),
    description:
      "Polish your forms with natural language commands. Enjoy a fluid editing process that adapts to your unique workflow.",
  },
  {
    title: (
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
          Intelligent Insights
        </span>

    ),
    description:
      "Uncover hidden patterns in responses. Our AI-powered analysis turns raw data into actionable strategies, evolving with your needs.",
  },
  
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <main className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      <BoxReveal boxColor={"#505f5a"} duration={0.75}>
  <Logo className="w-24 h-24 mb-4" />
</BoxReveal>

<BoxReveal boxColor={"#505f5a"} duration={0.75}>
  <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-6 text-matcha">
    Craft Forms with Zen-like Simplicity
  </h1>
</BoxReveal>

<BoxReveal boxColor={"#505f5a"} duration={0.75}>
  <p className="text-xl sm:text-2xl text-stone-600 mb-10 font-light max-w-3xl">
    Ryo Forms harmonizes AI precision with intuitive design, transforming
    the way you create, refine, and analyze forms.
  </p>
</BoxReveal>

        {/* <SignInButton forceRedirectUrl="/home" mode="modal">
          <button className="px-8 py-3 text-lg font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300">
            Begin Your Journey{" "}
            <ArrowRight className="inline-block ml-2" size={20} />
          </button>
        </SignInButton> */}

        <Link href="/home">
        

        <ConfettiButton className="px-8 py-3 text-lg font-light text-stone-100 bg-matcha rounded-md hover:bg-[#3E4A46] transition-all duration-300">
        Begin Your Journey{" "}
        <ArrowRight className="inline-block ml-2" size={20} />
        </ConfettiButton>

        </Link>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <ShineBorder
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
            color={["#505f5a", "#6366f1", "#505f5a"]}
          >
            <div
              key={index}
              className="bg-stone-50 p-8 border border-stone-200 hover:border-matcha transition-all duration-300"
            >
              
              <div className="text-3xl font-light mb-4 text-matcha">
                0{index + 1}
              </div>
              <h3 className="text-xl font-medium mb-2 text-stone-800">
                {feature.title}
              </h3>
              <p className="text-stone-600 text-center font-light">
                {feature.description}
              </p>
            </div>
            </ShineBorder>
          ))}
        </div>
      </main>
    </div>
  );
}
