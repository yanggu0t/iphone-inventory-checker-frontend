import React from "react";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LanguageSelector, ThemeDropdown } from "@/components/share";
const MainLayout: React.FC = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {/* <LanguageSelector /> */}
        <ThemeDropdown />
      </div>
      <div className="grid h-full w-full place-items-center overflow-auto p-4">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
