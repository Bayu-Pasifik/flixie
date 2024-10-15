import "./globals.css";
import { cn } from "../lib/utils";
import Providers from "@/util/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Flixie",
  description: "A Next.js app with TypeScript, React Query, and shadcn/ui",

  icons: {
    icon: "/icons.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-slate-800 font-sans antialiased")}>
        {/* <Navbar /> */}
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
