'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function TheoryBlock({ title, content }: { title: string; content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title || 'Theory'}</h3>
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed [&_pre]:bg-[#0d1117] [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-auto [&_:not(pre)>code]:bg-gray-100 [&_:not(pre)>code]:text-gray-800 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded [&_pre>code]:bg-transparent [&_pre>code]:text-inherit [&_pre>code]:p-0">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
