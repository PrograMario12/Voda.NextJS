import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voda.NextJS - Solo Dev Project Manager",
  description: "A gatekeeper for your project ideas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={cn(inter.className, "h-screen bg-background")}>
        <div className="flex h-full overflow-hidden">
          <Sidebar role={session?.user?.role} />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-5xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
