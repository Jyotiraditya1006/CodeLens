"use client";
import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ChevronRight, Zap, Code2, Activity, GitBranch } from 'lucide-react';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const analyzeRepo = async () => {
    if (!repoUrl) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/analyze/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });
      if (!res.ok) throw new Error("Failed to analyze repository");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (data) {
    return <Dashboard data={data} />;
  }

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex flex-col relative overflow-hidden">
      {/* Background ambient gradient similar to Handshake's cyan gradient, but dark mode tailored */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-[#0a0a0a] -z-10 pointer-events-none" />

      {/* Top Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="CodeLens Logo" width={140} height={40} className="object-contain h-10 w-auto" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2">Log in</button>
          <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors px-4 py-2 rounded-lg">Sign up</button>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1440px] mx-auto w-full">
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden lg:flex w-72 flex-col px-6 py-12 border-r border-white/5 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((section, i) => (
            <div key={i} className="mb-8">
              <h3 className="text-[18px] font-semibold text-white mb-3 px-3">{section.title}</h3>
              <div className="flex flex-col gap-1">
                {section.links.map((link, j) => (
                  <Link key={j} href={`/docs/${link.slug}`} className="text-left px-3 py-2.5 rounded-xl text-[14px] text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-12 md:py-24 max-w-4xl">
          {/* Header Section */}
          <div className="flex flex-col gap-8 mb-16">
            <h1 className="text-[64px] leading-[1.1] md:text-[80px] lg:text-[96px] font-extrabold tracking-tighter text-white">
              CODE HUB
            </h1>
            <p className="text-[20px] md:text-[24px] text-slate-400 max-w-[680px] leading-relaxed">
              Whether you're just getting started or auditing a massive monorepo, this is your one-stop shop to analyze, score, and auto-fix your code with AI.
            </p>
          </div>

          {/* Search / Input Bar (Replicating the Handshake Search Input) */}
          <div className="w-full max-w-[600px] mb-20 relative">
            <div className="flex h-14 items-center gap-3 rounded-xl border border-white/20 bg-[#111] px-4 shadow-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <GitBranch size={20} className="text-slate-400 shrink-0" />
              <input 
                aria-label="Repository URL" 
                className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-slate-500" 
                placeholder="Paste GitHub repository URL to analyze..." 
                type="text" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeRepo()}
              />
              <button 
                onClick={analyzeRepo}
                disabled={loading}
                className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 transition-colors shrink-0"
              >
                {loading ? 'Analyzing...' : 'Run Scan'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>

          {/* Popular Topics / Actions Grid */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[28px] md:text-[32px] font-semibold text-white tracking-tight">Popular actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Understand your Health Score", icon: Activity, slug: "deep-health-scoring" },
                { title: "How AI Auto-Fix patches work", icon: Zap, slug: "ai-auto-fix-agents" },
                { title: "Reviewing code smells", icon: Code2, slug: "what-is-codelens" },
                { title: "Connecting private repositories", icon: ShieldCheck, slug: "connecting-github" }
              ].map((item, idx) => (
                <Link key={idx} href={`/docs/${item.slug}`} className="flex min-h-[100px] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111] p-6 hover:bg-white/5 transition-colors group text-left">
                  <span className="text-[18px] text-slate-200 font-medium md:max-w-[80%]">{item.title}</span>
                  <ChevronRight size={24} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}


