import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full min-h-screen">
        {/* Top bar with sidebar trigger */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-pink-500/10">
          <SidebarTrigger className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors" />
          <div className="h-4 w-px bg-slate-700" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">VeritasAI Dashboard</p>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
