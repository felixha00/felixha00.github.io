import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import MiniSidebar from "@/components/fluff/MiniSidebar";
import "../globals.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SmoothScroll>
          <Navbar />
          <div className="relative flex min-h-dvh flex-col pb-4 lg:ml-8">
            <MiniSidebar />
            {children}
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-0 flex items-center justify-between bg-linear-to-t from-background to-100% to-transparent p-4" />
        </SmoothScroll>
      </TooltipProvider>
    </ThemeProvider>
  );
}
