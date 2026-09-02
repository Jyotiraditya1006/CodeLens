"use client";
import { ShieldCheck } from 'lucide-react';
import { docsContent } from '@/data/docs';
import Link from 'next/link';
import Image from 'next/image';
import { use, useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const doc = docsContent[slug];

    const sidebarLinks = [
    { title: "Getting Started", links: [
      { name: "What is CodeLens?", slug: "what-is-codelens" },
      { name: "Quickstart Guide", slug: "quickstart-guide" },
      { name: "Connecting GitHub", slug: "connecting-github" }
    ]},
    { title: "Core Features", links: [
      { name: "Deep Health Scoring", slug: "deep-health-scoring" },
      { name: "AI Auto-Fix Agents", slug: "ai-auto-fix-agents" },
      { name: "Cyclomatic Complexity", slug: "cyclomatic-complexity" }
    ]},
    { title: "Policies & Security", links: [
      { name: "Data Privacy", slug: "data-privacy" },
      { name: "SOC2 Compliance", slug: "soc2-compliance" },
      { name: "Enterprise SSO", slug: "enterprise-sso" }
    ]},
  ];

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <h1 className="text-2xl">Article not found</h1>
        <Link href="/" className="ml-4 text-blue-400 hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-[#0a0a0a] -z-10 pointer-events-none" />

      {/* Top Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CodeLens Logo" width={180} height={56} className="object-contain h-14 w-auto" />
        </Link>
        <div className="flex gap-4">
          <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2">Log in</button>
          <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors px-4 py-2 rounded-lg">Sign up</button>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col px-6 py-12 border-r border-white/5 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((section, i) => (
            <div key={i} className="mb-8">
              <h3 className="text-[18px] font-semibold text-white mb-3 px-3">{section.title}</h3>
              <div className="flex flex-col gap-1">
                {section.links.map((link, j) => (
                  <Link 
                    key={j} 
                    href={`/docs/${link.slug}`}
                    className={`text-left px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                      slug === link.slug 
                        ? 'bg-blue-500/10 text-blue-400 font-medium' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-16 md:py-20 max-w-4xl">
          <div className="flex flex-col gap-8 mb-16">
            <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-tight text-white leading-tight">
              {doc.title}
            </h1>
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
              {doc.content}
            </div>
          </div>
          
          {/* Helpful footer */}
          <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
            <span className="text-slate-400 text-sm">Was this article helpful?</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-colors">Yes</button>
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-colors">No</button>
            </div>
          </div>
        </main>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

