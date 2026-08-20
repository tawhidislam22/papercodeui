'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Code2, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-100 px-4 py-1.5 text-sm font-medium">
            <User className="w-3.5 h-3.5 mr-1.5" /> Our Story
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Reviving the lost art of coding on paper
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We believe that to truly understand how a machine thinks, you need to step away from the machine.
          </p>
        </div>

        <div className="prose prose-blue prose-lg max-w-none text-gray-600">
          <p>
            In the early days of computer science, programmers wrote their code on paper. They had to think through every loop, every variable, and every function before ever touching a keyboard. Today, IDEs autocomplete our thoughts, leaving us with a shallow understanding of the code we write.
          </p>
          <div className="my-12 grid sm:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <Code2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Work</h3>
              <p className="text-sm">Writing code by hand forces you to slow down and visualize the flow of logic. It builds a mental model that typing simply cannot replicate.</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <Brain className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modern AI</h3>
              <p className="text-sm">We combine this traditional method with state-of-the-art AI. Our OCR reads your handwriting, and our models analyze your logic instantly.</p>
            </div>
          </div>
          <p>
            Paper Code was built to bridge this gap. We provide the curriculum and the instant feedback of a modern platform, while enforcing the rigorous discipline of handwritten code. Whether you're a high school student learning Python or a senior developer practicing for whiteboard interviews, writing it out forces clarity.
          </p>
          <p className="mt-8 font-semibold text-gray-900 text-center">
            Join us in rewriting the way we learn to code.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
