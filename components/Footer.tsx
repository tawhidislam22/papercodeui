import Link from 'next/link';
import { Code as Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">Paper Code</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              Learn to code the traditional way. Write it on paper, upload a photo, and let our AI correct your mistakes and explain every error.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">How it works</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="/blogs" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Community</a></li>
              <li>
                <a href="#" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" /> Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2026 Paper Code. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
