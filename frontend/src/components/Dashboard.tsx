"use client";
import { useState, useMemo } from 'react';
import { Activity, Code, FileText, CheckCircle, AlertTriangle, ShieldCheck, Home, Settings, ArrowLeft, GitBranch, Zap, Terminal, Bug } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';

export default function Dashboard({ data }: { data: any }) {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = data.analysis;
  const aiInsights = stats.ai_insights || [];
  const repoName = data.repository.split('github.com/')[1] || data.repository;

  // Chart Data preparation
  const sizeData = useMemo(() => {
    return stats.file_metrics.slice(0, 5).map((f: any) => ({
      name: f.path.split('/').pop(),
      size: (f.size_bytes / 1024).toFixed(1) // KB
    }));
  }, [stats]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 70) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (score >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Top Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" />
            <span className="font-bold text-white tracking-tight">CodeLens</span>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <GitBranch size={16} />
            <span className="font-medium text-slate-200">{repoName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Analyze Another Repo
          </button>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto w-full px-6 py-8">
        
        {/* State 1: Overview Dashboard */}
        {!selectedIssue && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">Repository Overview</h1>
              <div className="flex bg-[#111] border border-white/5 rounded-lg p-1">
                <button className="px-4 py-1.5 rounded-md bg-white/10 text-white text-sm font-medium shadow-sm">Metrics</button>
                <button className="px-4 py-1.5 rounded-md text-slate-400 hover:text-white text-sm font-medium transition-colors">Settings</button>
              </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Health Score Card */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Activity size={120} />
                </div>
                <div className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Health Score</div>
                <div className="flex items-end gap-3">
                  <div className={`text-6xl font-black tracking-tighter ${getHealthColor(stats.health_score).split(' ')[0]}`}>
                    {stats.health_score}
                  </div>
                  <div className="text-slate-500 font-medium mb-1.5">/ 100</div>
                </div>
                <div className={`mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getHealthColor(stats.health_score)}`}>
                  {stats.health_score >= 80 ? 'Excellent' : stats.health_score >= 50 ? 'Needs Attention' : 'Critical Issues'}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Codebase Size</div>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-white">{stats.total_files}</div>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-2"><FileText size={14}/> Total Files Scanned</div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <div className="text-3xl font-bold text-white">{stats.total_lines.toLocaleString()}</div>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-2"><Code size={14}/> Lines of Code</div>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <div className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">AI Analysis</div>
                {aiInsights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center pb-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle size={24} className="text-emerald-400" />
                    </div>
                    <div className="text-emerald-400 font-medium">Perfect Health</div>
                    <div className="text-slate-500 text-sm mt-1">No code smells detected.</div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-center pb-4">
                    <div className="text-3xl font-bold text-red-400 flex items-center gap-3">
                      <AlertTriangle size={28} /> {aiInsights.length}
                    </div>
                    <div className="text-sm text-slate-500 mt-2">Files require remediation</div>
                    <div className="mt-4 text-xs text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                      Check the issues panel below to apply AI generated patches.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Largest Files Chart */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Largest Files</h3>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Size in KB</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sizeData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} width={140} />
                      <RechartsTooltip 
                        cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                        contentStyle={{backgroundColor: '#0f0f0f', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc'}} 
                        formatter={(value: any) => [`${value} KB`, 'Size']}
                      />
                      <Bar dataKey="size" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {sizeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Actionable Insights List */}
              <div className="bg-[#111] border border-white/5 rounded-2xl p-0 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bug size={18} className="text-blue-400" />
                    Identified Issues
                  </h3>
                  <span className="text-xs font-medium text-slate-400">{aiInsights.length} Total</span>
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar p-2">
                  {aiInsights.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <ShieldCheck size={48} className="text-slate-700 mb-4" />
                      <p className="text-slate-400 font-medium">Your codebase is spotless.</p>
                      <p className="text-slate-600 text-sm mt-1">No AI patches required.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {aiInsights.map((insight: any, idx: number) => {
                        const issueCount = insight.analysis?.issues?.length || 0;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedIssue(insight)}
                            className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all flex items-start gap-4 group border border-transparent hover:border-white/5"
                          >
                            <div className="mt-1 p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                              <AlertTriangle size={16} className="text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm text-slate-200 truncate">{insight.file}</div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                <Zap size={12} className="text-amber-400" /> AI patch available
                              </div>
                            </div>
                            <div className="text-xs font-semibold bg-white/5 text-slate-300 px-2 py-1 rounded-md border border-white/10">
                              {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* State 2: Issue Remediation View */}
        {selectedIssue && (
          <div className="animate-in slide-in-from-right-4 duration-300 h-[calc(100vh-8rem)] flex flex-col">
            
            {/* Remediation Header */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setSelectedIssue(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium bg-[#111] px-4 py-2 rounded-lg border border-white/5 hover:border-white/20"
              >
                <ArrowLeft size={16} /> Back to Overview
              </button>
              
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-slate-400">{selectedIssue.file}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex gap-2 items-center">
                   <CheckCircle size={16} /> Apply AI Patch
                </button>
              </div>
            </div>

            {/* Split Screen Editor & Analysis */}
            <div className="flex-1 flex gap-4 min-h-0">
              
              {/* Editor Side */}
              <div className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
                <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 gap-2">
                  <Terminal size={14} className="text-slate-500" />
                  <span className="text-xs font-mono text-slate-400">proposed_fix.ts</span>
                </div>
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage="typescript"
                    value={selectedIssue.analysis.suggested_patch || "// No patch suggested by AI"}
                    options={{ 
                      readOnly: true, 
                      minimap: { enabled: false },
                      padding: { top: 16 },
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                    }}
                  />
                </div>
              </div>

              {/* Analysis Side */}
              <div className="w-[400px] bg-[#111] border border-white/10 rounded-2xl flex flex-col shadow-xl">
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-transparent">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Zap size={18} className="text-blue-400" />
                    AI Explanations
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Review the issues detected in this file.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  {selectedIssue.analysis.issues?.map((iss: any, i: number) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-md">
                          {iss.type}
                        </span>
                        {iss.line_numbers && (
                           <span className="text-[11px] text-slate-500 font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">
                             L{iss.line_numbers.join('-')}
                           </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{iss.description}</p>
                    </div>
                  ))}
                  
                  {(!selectedIssue.analysis.issues || selectedIssue.analysis.issues.length === 0) && (
                    <div className="text-center p-6 text-slate-500 text-sm">
                      No specific line issues provided.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
