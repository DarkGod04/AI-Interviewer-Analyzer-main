"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser} from '@/app/provider';
import { motion } from 'framer-motion';
// Payment integration replaced with dummy system
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/services/supabaseClient';
import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  Headphones,
  BarChart3,
  ArrowRight,
  CreditCard,
  Sparkles
} from 'lucide-react';

function page() {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [maxCredits, setMaxCredits] = useState(1000);

  // Fetch user credits from DB
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from('Users')
        .select('credits')
        .eq('email', user.email)
        .single();
      if (data) setUserCredits(data.credits || 0);
    };
    fetchCredits();
  }, [user]);


  const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    originalPrice: 1499,
    period: 'month',
    description: 'Best for individuals or small teams starting with AI-powered interviews',
    icon: Zap,
    popular: false,
    credits: 100,
    features: [
      '100 AI-powered interview credits/month',
      'Access to basic question library',
      'Email support',
      'Interview duration up to 30 minutes',
      'Candidate performance summary'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 2999,
    originalPrice: 4499,
    period: 'month',
    description: 'Perfect for growing teams hiring regularly',
    icon: Crown,
    popular: true,
    credits: 500,
    features: [
      '500 AI-powered interview credits/month',
      'Advanced question customization',
      'Priority email & chat support',
      'Long-form interviews (up to 60 minutes)',
      'Detailed analytics & skill scoring',
      'Team collaboration tools',
      'Customizable interview templates'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 5999,
    originalPrice: 8999,
    period: 'month',
    description: 'For large organizations with high-volume recruitment needs',
    icon: Shield,
    popular: false,
    credits: 1000,
    features: [
      '1000+ AI-powered interview credits/month',
      'Unlimited question customization',
      '24/7 dedicated account manager',
      'Unlimited interview duration',
      'Advanced analytics & recruitment insights',
      'Multiple team workspaces',
      'Custom branding & white-label options',
      'SSO & enterprise-grade security'
    ]
  }
];


  const handlePayment = async (plan) => {
    if (!user) {
      toast.error("Authentication Required", { description: "Please log in to purchase a plan" });
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan.id);

    try {
      // Step 1: Call the dummy checkout backend
      const response = await fetch('/api/payment/dummy-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
          credits: plan.credits
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Dummy payment failed');

      // Step 2: Update credits
      const { data: userUpdate, error } = await supabase
        .from('Users')
        .update({ credits: plan.credits })
        .eq('email', user.email)
        .select();

      if (!error) {
        setUserCredits(plan.credits);
        setMaxCredits(plan.credits);
      }

      const subscriptionData = {
        planId: plan.id,
        planName: plan.name,
        status: 'active',
        startDate: new Date().toISOString(),
        amount: plan.price,
        paymentId: data.transactionId,
      };

      localStorage.setItem('servicedesk_subscription', JSON.stringify(subscriptionData));

      toast.success("Payment Successful!", {
        description: `Welcome to AI Recruter Pro ${plan.name} plan! Credits updated: ${plan.credits}`,
      });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Payment Error:', error);
      toast.error("Payment Failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen relative mt-5 rounded-[1.5rem] pt-24 p-5 glass-dark border border-yellow-500/20 overflow-hidden bg-[#050505]">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
      
      {/* Credits Progress Bar */}
      <div className="max-w-xl mx-auto mb-12 premium-card p-6 scale-95 md:scale-100 border border-yellow-500/20">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold flex items-center gap-2 text-white">
            <Zap className="w-4 h-4 text-yellow-400" />
            Interview Credits
          </span>
          <span className="text-sm font-black text-yellow-400 bg-yellow-500/10 px-3 py-1 border border-yellow-500/20 rounded-full tracking-widest">{userCredits} / {maxCredits}</span>
        </div>
        <Progress className="h-2.5 bg-black border border-slate-800" value={maxCredits ? (userCredits / maxCredits) * 100 : 0} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10 relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <Star className="h-3 w-3" />
            Limited Time Offer - Save up to 33%
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter mix-blend-difference">
            Choose Your <span className="gradient-text pb-2 pr-2">Perfect Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium">
            Unlock the full potential of AI Recruiter Pro with features designed 
            to scale with your business needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-6 md:mb-6 z-10' : 'mt-0 opacity-90 hover:opacity-100 transition-opacity'}`}>
              
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-yellow-400 text-black px-5 py-1.5 shadow-lg border-2 border-yellow-500 font-black text-xs uppercase tracking-[0.2em] rounded-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {/* Premium Card Structure */}
              <div className={`h-full flex flex-col premium-card p-8 bg-black/80 backdrop-blur-3xl shadow-xl ${plan.popular ? 'ring-1 ring-yellow-500/40' : 'border border-slate-800'}`}>
                <div className="text-center pb-6 border-b border-yellow-500/10 mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5 shadow-sm ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                      : 'bg-black border border-yellow-500/20'
                  }`}>
                    <plan.icon className={`h-7 w-7 ${
                      plan.popular ? 'text-black drop-shadow-md' : 'text-yellow-400'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-widest">{plan.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mt-2 h-10 line-clamp-2">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex flex-col items-center">
                    <div className="flex items-end justify-center gap-1 mb-1">
                      <span className="text-4xl font-black text-yellow-400 tracking-tighter">₹{plan.price}</span>
                      <span className="text-sm font-semibold text-slate-500 mb-1.5 tracking-wider uppercase">/{plan.period}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm text-slate-500 font-medium line-through">
                        ₹{plan.originalPrice}
                      </span>
                      <Badge variant="outline" className="text-[10px] text-green-400 bg-green-500/10 border-green-500/30 font-black uppercase py-0.5 px-2 rounded-sm shadow-sm tracking-widest">
                        Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <Button
                    className={`w-full mb-8 font-black tracking-widest uppercase h-12 shadow-[0_0_15px_rgba(251,191,36,0.3)] ${
                      plan.popular 
                        ? 'btn-glow border-0 text-black' 
                        : 'bg-black hover:bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400 transition-colors'
                    }`}
                    disabled={isProcessing && selectedPlan === plan.id}
                    onClick={() => handlePayment(plan)}>
                    {isProcessing && selectedPlan === plan.id ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        PROCESSING...
                      </span>
                    ) : (
                      <span className="flex items-center px-1">
                        <CreditCard className="mr-2 h-4 w-4" />
                        SIMULATE
                        <ArrowRight className="ml-auto h-4 w-4" opacity={1} />
                      </span>
                    )}
                  </Button>
                  
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-4">
                        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-md p-1 mt-0.5">
                          <Check className="h-3 w-3 text-yellow-400 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dummy Project Information */}
        <div className="premium-card bg-[#050505] border border-blue-500/30 p-6 mb-16 mx-auto max-w-4xl shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/30">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-widest text-blue-400 uppercase mb-2">
                Developer Preview Mode
              </h3>
              <p className="text-slate-400 text-sm font-mono leading-relaxed">
                SYSTEM MESSAGE: This environment is strictly for demonstration. Clicking "Simulate" verifies order logic and updates credits locally, bypassing financial gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border border-yellow-500/20 relative overflow-hidden bg-black">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent left-0 opacity-50"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
              Why Choose <span className="text-yellow-400">AI Recruiter Pro?</span>
            </h2>
            <p className="text-lg text-slate-400 font-mono max-w-2xl mx-auto">
              Equip your HR team with best-in-class automated hiring tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "TEAM COLLAB",
                description: "Seamlessly align your entire hiring committee with shared workspaces."
              },
              {
                icon: BarChart3,
                title: "ANALYTICS",
                description: "Rich insights into candidate performance and interview quality."
              },
              {
                icon: Headphones,
                title: "24/7 DATALINK",
                description: "Priority technical and account optimization assistance."
              },
              {
                icon: Shield,
                title: "SECURITY",
                description: "Bank-level encryption keeping your candidate data protected."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center group">
                <div className="w-16 h-16 rounded-xl bg-black border border-yellow-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)] flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110 duration-300">
                  <feature.icon className="h-7 w-7 text-yellow-500 transition-colors group-hover:text-yellow-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                </div>
                <h3 className="text-md font-black tracking-widest text-white uppercase mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 mb-10">
          <h2 className="text-xl font-black text-slate-300 uppercase tracking-widest mb-6">
            Need a high-volume custom plan?
          </h2>
          <Button variant="outline" size="lg" className="rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-black font-black uppercase tracking-[0.2em] px-8 h-12">
            Contact Sales
          </Button>
        </div>

      </div>
    </div>
  );
};

export default page;