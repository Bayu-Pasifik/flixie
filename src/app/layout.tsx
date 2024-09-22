import "./globals.css";

import { cn } from "../lib/utils";
import Providers from "@/util/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Flixie",
  description: "A Next.js app with TypeScript, React Query, and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
