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
    <div className="min-h-screen relative mt-5 rounded-2xl border-none pt-24 p-5 glass-card overflow-hidden">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Credits Progress Bar */}
      <div className="max-w-xl mx-auto mb-12 premium-card p-6 scale-95 md:scale-100">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold flex items-center gap-2 text-slate-800">
            <Zap className="w-4 h-4 text-primary" />
            Interview Credits
          </span>
          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{userCredits} / {maxCredits}</span>
        </div>
        <Progress className="h-2.5 bg-slate-100" value={maxCredits ? (userCredits / maxCredits) * 100 : 0} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10 relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 tag-pill bg-primary/10 border border-primary/20 text-primary">
            <Star className="h-4 w-4" />
            Limited Time Offer - Save up to 33%
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Choose Your <span className="gradient-text font-caramel pb-2 pr-2">Perfect Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium">
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
                  <Badge className="bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 text-white px-5 py-1.5 shadow-lg border-0 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {/* Premium Card Structure */}
              <div className={`h-full flex flex-col premium-card p-8 bg-white/60 backdrop-blur-xl ${plan.popular ? 'glow-border ring-2 ring-primary/20 shadow-2xl' : ''}`}>
                <div className="text-center pb-6 border-b border-slate-100 mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5 shadow-sm ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-primary to-violet-600' 
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <plan.icon className={`h-7 w-7 ${
                      plan.popular ? 'text-white drop-shadow-md' : 'text-slate-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800">{plan.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-2 h-10 line-clamp-2">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex flex-col items-center">
                    <div className="flex items-end justify-center gap-1 mb-1">
                      <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">₹{plan.price}</span>
                      <span className="text-sm font-semibold text-slate-500 mb-1.5">/{plan.period}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm text-slate-400 font-medium line-through">
                        ₹{plan.originalPrice}
                      </span>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200 font-bold uppercase py-0 px-2 rounded-sm shadow-sm">
                        Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <Button
                    className={`w-full mb-8 font-bold h-12 shadow-md ${
                      plan.popular 
                        ? 'btn-glow border-0' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 transition-colors'
                    }`}
                    disabled={isProcessing && selectedPlan === plan.id}
                    onClick={() => handlePayment(plan)}>
                    {isProcessing && selectedPlan === plan.id ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center px-1">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Simulate Payment
                        <ArrowRight className="ml-auto h-4 w-4" opacity={0.7} />
                      </span>
                    )}
                  </Button>
                  
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="bg-emerald-50 rounded-full p-1 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dummy Project Information */}
        <div className="premium-card bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-100 p-6 mb-16 mx-auto max-w-4xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="bg-white p-3 rounded-full shadow-sm border border-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Developer Preview Mode
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                This environment is strictly for demonstration. Clicking "Simulate Payment" verifies your order logic and updates your credits locally in real-time, bypassing any actual financial gateways.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border-t border-white/80 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent left-0"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Why Choose <span className="gradient-text font-caramel pb-1 px-1">AI Recruiter Pro?</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Equip your HR team with best-in-class automated hiring tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamlessly align your entire hiring committee with shared workspaces."
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Rich insights into candidate performance and interview quality."
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Priority technical and account optimization assistance."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption keeping your candidate data protected."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-5 transition-transform group-hover:-translate-y-2 duration-300">
                  <feature.icon className="h-7 w-7 text-primary transition-colors group-hover:text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Need a high-volume custom plan for your enterprise?
          </h2>
          <Button variant="outline" size="lg" className="rounded-full shadow-sm border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary font-semibold px-8 h-12">
            Contact Sales
          </Button>
        </div>

      </div>
    </div>
  );
};

export default page;