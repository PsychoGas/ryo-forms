import "~~/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`min-h-screen bg-stone-50 text-neutral-900 font-sans antialiased ${fontSans.variable}`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
