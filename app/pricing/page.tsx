'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 px-4 py-1.5 text-sm font-medium">
            <Flame className="w-3.5 h-3.5 mr-1.5" /> Simple Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Start learning for free, upgrade when you need more.
          </h1>
          <p className="text-lg text-gray-500">
            Master the art of coding by writing it by hand. Our AI is ready to review your code 24/7.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Student</h3>
            <div className="text-4xl font-extrabold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-gray-500 mb-8">Perfect for beginners just starting their coding journey.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Access to introductory lessons',
                '5 AI code reviews per day',
                'Basic IDE execution',
                'Community forum access'
              ].map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth?tab=register">
              <Button className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100" size="lg">Get Started</Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Scholar</h3>
            <div className="text-4xl font-extrabold text-gray-900 mb-6">$12<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <p className="text-gray-500 mb-8">For serious learners who want unlimited AI feedback.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Access to all premium lessons',
                'Unlimited AI code reviews',
                'Advanced IDE features',
                'Priority support',
                'Official Paper Code Certificates'
              ].map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth?tab=register">
              <Button className="w-full text-white shadow-lg" size="lg" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
