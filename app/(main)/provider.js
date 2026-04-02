import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full min-h-screen">
        {/* Top bar with sidebar trigger */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
          <SidebarTrigger className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg p-1.5 transition-colors" />
          <div className="h-4 w-px bg-slate-300" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">VeritasAI Dashboard</p>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
