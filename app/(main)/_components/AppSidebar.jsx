"use client"
import React, { useState, useEffect } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Plus, Zap } from 'lucide-react';
import Link from "next/link";
import { SideBarOptions } from "@/services/Constants";
import { usePathname } from "next/navigation"
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';

export function AppSidebar() {

    const path = usePathname();
    const { user } = useUser();
    const [userCredits, setUserCredits] = useState(0);

    useEffect(() => {
        const fetchCredits = async () => {
            if (!user?.email) return;
            const { data } = await supabase
                .from('Users')
                .select('credits')
                .eq('email', user.email)
                .single();
            if (data) setUserCredits(data.credits || 0);
        };
        fetchCredits();
    }, [user]);

    const displayMax = Math.max(userCredits, 100);
    const creditPercent = displayMax ? Math.round((userCredits / displayMax) * 100) : 0;

    return (
        <Sidebar>
            {/* ── Logo ── */}
            <SidebarHeader className="flex items-center mt-6 flex-col gap-5 px-5 pb-4 border-b border-slate-200/60">
                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition duration-500" />
                    <img
                        src={'/veritas_logo.png'}
                        alt='VeritasAI Logo'
                        width={136}
                        height={96}
                        className='relative z-10 drop-shadow-sm'
                    />
                </div>

                {/* Create Interview CTA */}
                <Link href="/dashboard/create-interview" className="w-full">
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        Create Interview
                    </div>
                </Link>
            </SidebarHeader>

            {/* ── Nav Items ── */}
            <SidebarContent className="mt-4 px-3">
                <SidebarGroup>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Menu</p>
                    <SidebarMenu className="space-y-0.5">
                        {SideBarOptions.map((option, index) => {
                            const isActive = path === option.path;
                            return (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <Link href={option.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                                                isActive
                                                    ? 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                            }`}>
                                                <option.icon className="h-4 w-4" />
                                            </div>
                                            <span className="tracking-wide">{option.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* ── Credits Footer ── */}
            <SidebarFooter className="p-4 border-t border-slate-200/60">
                <div className="relative overflow-hidden rounded-2xl p-4"
                    style={{
                        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
                        border: '1px solid rgba(99,102,241,0.15)',
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                style={{ background: 'rgba(99,102,241,0.12)' }}>
                                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Credits</span>
                        </div>
                        <span className="text-lg font-extrabold text-indigo-600">{userCredits}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-white/80 rounded-full overflow-hidden border border-indigo-100">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${creditPercent}%`,
                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                            }}
                        />
                    </div>

                    <Link href="/billings">
                        <div className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-center text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-600 hover:text-white cursor-pointer transition-all duration-300 shadow-sm">
                            Upgrade Plan
                        </div>
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
