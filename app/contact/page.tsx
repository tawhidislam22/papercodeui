'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 px-4 py-1.5 text-sm font-medium">
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Get in Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            We'd love to hear from you
          </h1>
          <p className="text-lg text-gray-500">
            Have a question about our platform, pricing, or enterprise plans? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">First Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Last Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Email Address</label>
                <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="How can we help?" />
              </div>
              <Button type="submit" className="w-full text-white gap-2" size="lg" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Chat with us</h3>
                <p className="text-gray-500 text-sm mb-2">Our friendly team is here to help.</p>
                <a href="mailto:hi@papercode.com" className="text-blue-600 font-medium hover:underline">hi@papercode.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Visit us</h3>
                <p className="text-gray-500 text-sm mb-2">Come say hello at our office HQ.</p>
                <p className="text-gray-900 font-medium">100 Tech Hub Blvd<br/>San Francisco, CA 94107</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
