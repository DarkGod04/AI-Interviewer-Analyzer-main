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
                    <h2 className="text-sm font-semibold text-slate-200 ml-1">Job Position</h2>
                    <Input
                        onChange={(event) => onHandleInputChange("jobPosition", event.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="mt-2 h-12 bg-black/40 border-white/10 ring-1 ring-transparent text-slate-100 placeholder:text-slate-500 focus-visible:ring-yellow-500/50 shadow-sm transition-all focus:bg-black/60"
                    />
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-200 ml-1">Job Description</h2>
                    <Textarea
                        onChange={(event) => onHandleInputChange("jobDescription", event.target.value)}
                        className="mt-2 h-[150px] resize-none bg-black/40 border-white/10 ring-1 ring-transparent text-slate-100 placeholder:text-slate-500 focus-visible:ring-yellow-500/50 shadow-sm transition-all p-4 focus:bg-black/60"
                        placeholder="Paste the detailed requirements and tech stack here..."
                    />
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-200 ml-1">Interview Duration</h2>
                    <Select onValueChange={(value) => {
                        const duration = parseInt(value);
                        onHandleInputChange("duration", isNaN(duration) ? value : duration);
                    }}>
                        <SelectTrigger className="w-full mt-2 h-12 bg-black/40 border-white/10 ring-1 ring-transparent text-slate-100 focus:ring-yellow-500/50 shadow-sm">
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent className="glass text-slate-200">
                            <SelectItem value="5" className="focus:bg-white/10 focus:text-white cursor-pointer">5 Minutes (Swift Screen)</SelectItem>
                            <SelectItem value="15" className="focus:bg-white/10 focus:text-white cursor-pointer">15 Minutes (Standard)</SelectItem>
                            <SelectItem value="30" className="focus:bg-white/10 focus:text-white cursor-pointer">30 Minutes (Deep Dive)</SelectItem>
                            <SelectItem value="45" className="focus:bg-white/10 focus:text-white cursor-pointer">45 Minutes (Technical)</SelectItem>
                            <SelectItem value="60" className="focus:bg-white/10 focus:text-white cursor-pointer">60 Minutes (Extensive)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <h2 className="text-sm font-semibold text-slate-200 ml-1 mb-3">Interview Focus Areas</h2>
                    <div className="flex gap-3 flex-wrap">
                        {InterviewType.map((type, index) => {
                            const isSelected = selectedTypes.includes(type.title);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 cursor-pointer py-2 px-4 border rounded-full transition-all duration-300 font-medium text-sm ${
                                        isSelected 
                                        ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.2)] text-yellow-400' 
                                        : 'bg-black/40 border-white/10 text-slate-400 hover:bg-black/60 hover:border-white/30 hover:text-slate-200'
                                    }`}
                                    onClick={() => handleInterviewTypeChange(type.title)}
                                >
                                    <type.icon className={`w-4 h-4 ${isSelected ? 'text-yellow-400' : 'text-slate-500'}`} />
                                    <span>{type.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="pt-6 flex justify-end">
                    <Button 
                        onClick={() => GoToNext()} 
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black shadow-xl shadow-yellow-500/20 h-12 px-8 rounded-xl font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
                    >
                        Generate Questions <Sparkles className="ml-2 w-5 h-5 text-black" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FormContainer;
