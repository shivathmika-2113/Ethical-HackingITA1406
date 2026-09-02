import { useState } from 'react';
import {
  Brain, Activity, Eye, Sparkles, Cpu,
  TrendingUp, AlertTriangle, Network, Shield,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/ui/Layout';
import { SeverityBadge } from '@/components/ui/Badges';
import { RiskBar } from '@/components/ui/RiskBar';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useToast } from '@/components/ui/Toast';
import { aiInsight } from '@/data/mockData';

export function AIAnalystPage() {
  const toast = useToast();
  const [showTimeline, setShowTimeline] = useState(false);
  const [showRiskEngine, setShowRiskEngine] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader title="AI Security Analyst" subtitle="Intelligent monitoring and threat analysis powered by AI" />

      {/* AI Status */}
      <div className="card p-5 bg-gradient-to-r from-brand-50 to-teal-50 border-brand-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Brain size={24} className="text-brand-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">AI Security Status — Monitoring</h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                <AnimatedCounter value={184} /> assets · <AnimatedCounter value={4602} /> network events analyzed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-brand-200">
            <Cpu size={16} className="text-brand-600" />
            <span className="text-xs font-semibold text-brand-700">AI Engine: Active</span>
          </div>
        </div>
      </div>

      {/* AI Insight Panel */}
      <SectionCard>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">AI Insight</h3>
          </div>
          <SeverityBadge severity={aiInsight.severity} />
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <p className="text-base font-semibold text-slate-900 mb-4">{aiInsight.title}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Source', value: aiInsight.source },
              { label: 'Destination', value: aiInsight.destination },
              { label: 'Pattern', value: aiInsight.pattern },
              { label: 'Classification', value: aiInsight.classification },
            ].map((d) => (
              <div key={d.label} className="p-3 rounded-lg bg-white border border-slate-200">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{d.label}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-white border border-slate-200">
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">AI Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500 transition-all duration-1000" style={{ width: `${aiInsight.confidence}%` }} />
                </div>
                <span className="text-sm font-bold text-brand-700">{aiInsight.confidence}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-1">Severity</p>
              <SeverityBadge severity={aiInsight.severity} />
            </div>
          </div>
        </div>

        {/* Why detected */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Why This Was Detected</h4>
          <div className="space-y-1.5">
            {aiInsight.reasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-slate-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setShowTimeline(true); toast('info', 'Investigation timeline opened'); }}
          className="btn-primary mt-4"
        >
          <Eye size={16} />
          Investigate
        </button>
      </SectionCard>

      {/* Event Timeline */}
      {showTimeline && (
        <SectionCard title="Event Timeline" subtitle="Chronological sequence of detected events">
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
            {aiInsight.timeline.map((event, i) => (
              <div key={i} className="relative pb-4 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100" />
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-semibold text-brand-600 w-20 shrink-0">{event.time}</span>
                  <span className="text-sm text-slate-700">{event.event}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* AI Risk Engine */}
      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">AI Risk Engine</h3>
          </div>
          <button
            onClick={() => setShowRiskEngine((v) => !v)}
            className="btn-secondary text-xs py-2 px-3"
          >
            {showRiskEngine ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showRiskEngine ? (
          <div className="space-y-3 animate-fade-in">
            {aiInsight.riskFactors.map((factor, i) => (
              <RiskBar key={factor.label} label={factor.label} score={factor.score} delay={i * 80} />
            ))}
            <div className="flex items-center justify-between mt-4 p-4 rounded-xl bg-slate-900 text-white">
              <div>
                <span className="text-sm font-medium">Final Risk Score</span>
                <p className="text-xs text-slate-400 mt-0.5">Weighted aggregate of all factors</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{aiInsight.finalRisk}</span>
                <span className="text-sm text-slate-300">/ 100</span>
                <SeverityBadge severity="critical" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              AI score is a demonstration prototype score, not a certified medical safety decision.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-critical-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-critical-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Final Risk: {aiInsight.finalRisk} / 100</p>
                <p className="text-xs text-slate-500">Based on {aiInsight.riskFactors.length} risk factors</p>
              </div>
            </div>
            <SeverityBadge severity="critical" />
          </div>
        )}
      </SectionCard>

      {/* AI capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Network, title: 'Network Behavior Analysis', desc: 'Monitors traffic patterns for anomalies and reconnaissance activity', color: 'text-brand-600 bg-brand-50' },
          { icon: Shield, title: 'Asset Risk Scoring', desc: 'Calculates risk scores based on exposure, criticality and healthcare impact', color: 'text-teal-600 bg-teal-50' },
          { icon: Activity, title: 'Threat Correlation', desc: 'Correlates multiple events to identify coordinated attack sequences', color: 'text-high-600 bg-high-50' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <Icon size={20} />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
