import React from "react";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

const MainLayout: React.FC = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="h-full w-full overflow-auto p-4">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export { MainLayout };
