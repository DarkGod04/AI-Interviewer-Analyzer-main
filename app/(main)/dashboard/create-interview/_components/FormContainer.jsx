import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

function FormContainer({ onHandleInputChange, GoToNext }) {
    const [selectedTypes, setSelectedTypes] = useState([]);

    const handleInterviewTypeChange = (type) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];

        setSelectedTypes(newTypes);
        onHandleInputChange("types", newTypes);
    };

    useEffect(() => {
        console.log("Selected types:", selectedTypes);
    }, [selectedTypes]);

    return (
        <div className="glass-card p-6 md:p-10 rounded-3xl relative overflow-hidden">
            {/* Subtle corner glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Job Position</h2>
                    <Input
                        onChange={(event) => onHandleInputChange("jobPosition", event.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="mt-2 h-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-white/10 ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-primary/50 shadow-sm transition-all"
                    />
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Job Description</h2>
                    <Textarea
                        onChange={(event) => onHandleInputChange("jobDescription", event.target.value)}
                        className="mt-2 h-[150px] resize-none bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-white/10 ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-primary/50 shadow-sm transition-all p-4"
                        placeholder="Paste the detailed requirements and tech stack here..."
                    />
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Interview Duration</h2>
                    <Select onValueChange={(value) => {
                        const duration = parseInt(value);
                        onHandleInputChange("duration", isNaN(duration) ? value : duration);
                    }}>
                        <SelectTrigger className="w-full mt-2 h-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-white/10 ring-1 ring-slate-200 dark:ring-slate-800 focus.ring-primary/50 shadow-sm">
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent className="glass">
                            <SelectItem value="5">5 Minutes (Swift Screen)</SelectItem>
                            <SelectItem value="15">15 Minutes (Standard)</SelectItem>
                            <SelectItem value="30">30 Minutes (Deep Dive)</SelectItem>
                            <SelectItem value="45">45 Minutes (Technical)</SelectItem>
                            <SelectItem value="60">60 Minutes (Extensive)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">Interview Focus Areas</h2>
                    <div className="flex gap-3 flex-wrap">
                        {InterviewType.map((type, index) => {
                            const isSelected = selectedTypes.includes(type.title);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 cursor-pointer py-2 px-4 border rounded-full transition-all duration-300 font-medium text-sm ${
                                        isSelected 
                                        ? 'bg-gradient-to-r from-primary/10 to-violet-500/10 border-primary shadow-[0_0_15px_rgba(79,70,229,0.15)] text-primary' 
                                        : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                                    }`}
                                    onClick={() => handleInterviewTypeChange(type.title)}
                                >
                                    <type.icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                                    <span>{type.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                    <Button 
                        onClick={() => GoToNext()} 
                        className="bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white shadow-xl shadow-primary/25 h-12 px-8 rounded-xl font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
                    >
                        Generate Questions <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FormContainer;
