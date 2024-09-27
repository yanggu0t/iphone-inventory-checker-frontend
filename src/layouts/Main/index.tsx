import React from "react";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeDropdown } from "@/components/share";
import { TooltipProvider } from "@/components/ui/tooltip";
const MainLayout: React.FC = () => {
  return (
    <TooltipProvider>
      <div className="relative h-screen w-screen overflow-hidden">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <ThemeDropdown />
        </div>
        <div className="grid h-full w-full place-items-center overflow-auto px-80 py-24">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
