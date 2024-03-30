import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import "react-loading-skeleton/dist/skeleton.css";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Quilly",
  description: "Quilly is a blog platform for developers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body
            className={cn(
              "grainy min-h-screen font-sans antialiased",
              inter.className,
            )}
          >
            <Navbar />
            {children}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
              <ModeToggle />
            </div>
            <Toaster />
          </body>
        </ThemeProvider>
      </TRPCReactProvider>
    </html>
  );
}
