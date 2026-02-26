'use client';

import { useState } from 'react';
import {
  Brain,
  Rocket,
  MessageSquare,
  ExternalLink,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { QACard, QuestionCard, InfoBox, TabBar, type TabConfig } from '../components';

const tabs: TabConfig[] = [
  { id: 'pov', label: 'AI-First POV', icon: Lightbulb },
  { id: 'stories', label: 'Builder Stories', icon: Rocket },
  { id: 'questions', label: 'Questions', icon: MessageSquare },
  { id: 'cheatsheet', label: 'Cheat Sheet', icon: Brain },
];

function AboutNickSection() {
  return (
    <div className="space-y-4 mb-6">
      <InfoBox
        title="About Nick"
        variant="primary"
        links={[
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nicholasbarrington/' },
          { label: 'Hg Profile', href: 'https://hgcapital.com/team/nick-barrington' },
        ]}
      >
        <ul className="space-y-1">
          <li><strong>Nicholas Barrington</strong> — Value Creation Data Team, Hg</li>
          <li><strong>Focus:</strong> Data Engineering & AI across portfolio</li>
          <li><strong>Previously:</strong> Head of Data at TRIBE (influencer marketing SaaS, Melbourne)</li>
          <li>Built data science & analytics platform from scratch at TRIBE</li>
          <li>Fellow Australian, moved to London 2018</li>
          <li>Has hired 3x interims since October for applied AI engineering</li>
        </ul>
      </InfoBox>

      <InfoBox
        title="Interview Context"
        variant="amber"
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <span><strong>Date:</strong> Friday (TBC)</span>
        </div>
        <p className="mb-2">
          <strong>Briefing:</strong> &quot;The focus will be on how to think about AI-first engineering throughout the portfolio and how to implement this in practice&quot;
        </p>
        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700 space-y-1">
          <p>• This is likely about <strong>BUILDING</strong> AI solutions for/with portfolio companies (not internal Hg ops like Sophie&apos;s role)</p>
          <p>• Nick is technical — he&apos;ll want substance, not frameworks</p>
        </div>
      </InfoBox>
    </div>
  );
}

function AIFirstPOVTab() {
  return (
    <div className="space-y-4">
      <AboutNickSection />

      <QACard
        question="How do you think about AI-first engineering?"
        keyPoints={[
          "Start with process, not tools — map workflows before automating",
          "Assess: tech stack maturity, data quality, team capability",
          "Prioritise: high-value, low-risk, fast feedback loops first",
          "\"Fire bullets then cannonballs\" — Hg's own language",
          "Architecture matters: design for AI-native (agentic workflows, LLM-in-the-loop, structured outputs)",
          "Measurement: dev velocity, cycle time, deployment frequency, defect rates",
        ]}
        fullAnswer={`My starting point is always process, not tools. Before you introduce any AI tooling, you need to understand the workflows you're operating in — what are the inputs, outputs, decision points, bottlenecks? Map that first.

Then I assess readiness: what's the tech stack maturity, data quality, team capability? You can't deploy AI-first engineering into a team that doesn't have basic CI/CD or clean data pipelines.

Once you have that map, prioritise ruthlessly. High-value, low-risk, fast feedback loops first. Hg uses the phrase 'fire bullets then cannonballs' — I think that's exactly right. Small experiments that prove value, then scale the ones that work.

Architecture matters too — you're not just adding copilot to an IDE. You're designing systems where AI is a first-class participant: agentic workflows, LLM-in-the-loop for decisions, structured outputs that feed into deterministic systems.

And you measure everything — dev velocity, cycle time, deployment frequency, defect rates. If you can't measure it, you're guessing.`}
        defaultOpen
      />

      <QACard
        question="How would you implement this across a portfolio of 58+ companies?"
        keyPoints={[
          "Pattern match: what's common (CS automation, internal tooling, dev velocity) vs bespoke",
          "Can't one-size-fits-all — different maturity levels, verticals, team sizes",
          "Playbook approach: repeatable frameworks, customised execution",
          "Start with willing companies, prove value, create pull not push",
          "Knowledge sharing across portfolio (leverage Hg's Hive platform)",
          "The \"re-founding\" question: when to layer AI on vs rebuild from scratch",
        ]}
        fullAnswer={`The first thing I'd do is pattern match. Across 58 companies, there are common problems — customer support automation, internal tooling, dev velocity — and bespoke ones unique to each vertical. You need to identify both.

You can't one-size-fits-all this. A 500-person company with legacy Java monoliths needs a different approach than a 50-person startup on modern cloud-native stack. So I'd think of it as repeatable frameworks with customised execution — a playbook, not a script.

Practically, I'd start with willing companies. Find the ones already experimenting, who have internal champions. Prove value there, document what works, and create pull across the portfolio rather than pushing. Hg's Hive platform is perfect for this — share the wins and the playbooks.

The harder question is when to layer AI onto existing systems versus fundamentally rebuild. That's the 're-founding' question. My instinct is: layer first for quick wins, but plan for re-founding where the architecture is fundamentally limiting.`}
      />

      <QACard
        question="What does AI-first engineering look like in practice for a 10-year-old software company?"
        keyPoints={[
          "Don't rip and replace — find the seams",
          "Dev tooling first (fastest ROI, lowest risk): AI-assisted coding, CI/CD, testing",
          "Then internal tooling: support, ops, data pipelines",
          "Then product: AI features that create customer value",
          "Team shape evolves: orchestrators not just engineers",
          "The 1 PM + 2 engineers + agents model — promising but has failure modes",
        ]}
        fullAnswer={`You don't rip and replace. You find the seams — the natural boundaries in the system where you can introduce AI without destabilising everything.

I'd sequence it in three phases. First, dev tooling — this is fastest ROI and lowest risk. AI-assisted coding with tools like Cursor or Claude Code, AI in CI/CD pipelines for code review and testing, automated documentation. Every engineering team can benefit from this immediately.

Second, internal tooling. Customer support automation, operational workflows, data pipeline management. These are high-pain, high-frequency problems where AI adds clear value.

Third, product. This is where you build AI features that create direct customer value — but it's also highest risk, so you earn the right to do it by proving competence in phases one and two.

As you move through these phases, the team shape evolves. Engineers become orchestrators — they're managing AI agents, reviewing output, handling edge cases. The model I've seen Hg talk about — 1 PM, 2 engineers, leveraged by up to 12 AI agents — that's directionally right, but it has failure modes. You need strong engineering judgment to know when the agents are producing good work versus confident garbage. That's the skill gap most teams underestimate.`}
      />
    </div>
  );
}

function BuilderStoriesTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Ruk — AI Transformation in Practice"
        keyPoints={[
          "Saw agentic AI would change how work gets done — wanted to push it",
          "First principles: mapped ALL processes across every function",
          "Built Ruk: autonomous agent with persistent identity, memory, knowledge graph",
          "Technical: Claude primary model, LanceDB vector DB, custom knowledge graph, Slack/Telegram/WhatsApp integrations",
          "Architecture: identity files, protocols, Kaizen (self-improvement), context management layer",
          "Results: 2x profit, 2x clients, 50% headcount reduction, 2.3x dev velocity",
          "Team shifted from \"how do I build this\" to \"how do I get this built\"",
          "Developers became orchestrators — reviewing output, handling edge cases",
          "My role: end-to-end — architecture partnership, process design, context layer, adoption",
        ]}
        fullAnswer={`At Fractal Labs, we saw agentic AI was going to fundamentally change how work gets done — not just coding faster, but restructuring entire workflows. We wanted to see how far we could push it.

We went back to first principles. Mapped out all our processes across every function — not just engineering. Identified where proactive agentic activity could add value. That led to building Ruk, which is an autonomous AI agent with persistent identity, semantic memory, and a custom knowledge graph.

On the technical side: Claude as the primary model, LanceDB for vector storage, custom knowledge graph mapping people, projects, and relationships. Integrates with Slack, Telegram, WhatsApp. The architecture has identity files that define who it is, protocols for how it operates, a Kaizen system for self-improvement, and a context management layer for handling multiple projects.

The results: doubled profit margin, doubled the number of clients, halved headcount. Dev velocity went up 2.3x. But the bigger shift was cultural — developers stopped asking 'how do I build this' and started asking 'how do I get this built.' They became orchestrators, not just engineers.

My role was end-to-end. I partnered on architecture, owned the process design — mapping which workflows to target, designing human-in-the-loop checkpoints — built the context layer, and drove adoption across the team.`}
        defaultOpen
      />

      <QACard
        question="Deal Committee — Solo AI-First Build"
        keyPoints={[
          "AI co-pilot for people acquiring small businesses",
          "Solo build, end-to-end — MVP in 1 week using Claude Code",
          "Tech: TypeScript, React, Supabase, OpenAI agent builder + vector stores, Claude API",
          "Codebase optimised for agentic development: Claude MD files, structured docs, design systems",
          "Chrome extension import, instant analysis, AI board evaluation, lightweight CRM",
          "Live with active users, organic growth, no real GTM yet",
          "Meta-lesson: used AI to BUILD, not just AI in the product",
        ]}
        fullAnswer={`Deal Committee is something I built solo, end-to-end — an AI co-pilot for people acquiring small businesses.

The interesting bit for this conversation is how I built it. MVP in one week using Claude Code as my primary pair programmer. The entire codebase is optimised for agentic development — Claude MD files, structured documentation the AI can navigate, defined design systems, entity relationship maps. The AI doesn't just write code; it understands the product architecture.

Tech stack: TypeScript, React, Supabase, with an AI layer combining OpenAI's agent builder and vector stores for document retrieval, plus Claude API for analysis and reasoning. Users import deals via Chrome extension or upload documents, get instant analysis and scoring, and there's an AI board that evaluates from multiple perspectives.

It's live with active users, growing organically without any real go-to-market. But the meta-lesson is: I didn't just put AI in the product — I used AI to build the product. The development process itself was AI-first. That's the shift I think most companies haven't made yet.`}
      />

      <QACard
        question="Rafa (Personal AI Agent) — Living It Daily"
        keyPoints={[
          "Built a personal AI agent that manages email, calendar, tasks, memory",
          "Runs on OpenClaw (Claude-based), persistent identity, long-term memory",
          "Checks email proactively, monitors calendar, manages Todoist tasks",
          "Tool integrations: Gmail, Google Calendar, Notion, GitHub, WhatsApp, Telegram",
          "Not a demo — genuinely use it every day for real operational work",
          "Shows commitment: I don't just talk about AI-first — I live it",
        ]}
        fullAnswer={`I also built a personal AI agent called Rafa that manages my day-to-day operational overhead. It runs on OpenClaw — Claude-based — with persistent identity and long-term memory across sessions.

It proactively checks my email, monitors my calendar, manages my task list in Todoist, and integrates with Gmail, Google Calendar, Notion, GitHub, WhatsApp, and Telegram. It has its own memory files, personality, and operational protocols.

This isn't a demo or a weekend project I showed off once. I use it every single day for real work — it's checking my email right now, probably. The reason I mention it is that I think the best way to understand AI-first engineering is to live it. When you run your own life on AI tools, you develop intuition for what works, what breaks, and where the real value is.`}
      />
    </div>
  );
}

function QuestionsTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Questions to ask Nick about the role and his work.
      </p>

      <QuestionCard
        question="What patterns have you seen across the portfolio — where does AI-first engineering stick vs where does it struggle?"
        variant="primary"
      />

      <QuestionCard
        question="How do you balance standardising an approach across 58 companies vs letting each find their own path?"
        variant="primary"
      />

      <QuestionCard
        question="What's the relationship between Catalyst and the Value Creation data team — where do you hand off?"
        variant="secondary"
      />

      <QuestionCard
        question="Where are you seeing the biggest gap between AI hype and reality in portfolio engineering teams?"
        variant="secondary"
      />

      <QuestionCard
        question="What does the day-to-day look like for the interims you've hired — embedded in portcos or working centrally?"
        variant="default"
      />

      <QuestionCard
        question="What does success look like at 90 days in this role?"
        variant="default"
      />
    </div>
  );
}

function CheatSheetTab() {
  return (
    <div className="space-y-2">
      {/* Row 1: TMAY + Ruk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border-2 border-amber-400">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-sm">TMAY (60-90s)</h4>
          <ol className="text-xs text-amber-800 dark:text-amber-200 space-y-0.5 list-decimal list-inside">
            <li>Finance + consulting Australia (5y)</li>
            <li>Founded Snakr → VC, London, wound down COVID</li>
            <li>Loved building → PM</li>
            <li>GenAI boom → <strong>building daily since</strong></li>
            <li>AI transformation + products</li>
            <li>Fractal Labs → Ruk</li>
            <li>Want: scale, needle-moving, serious people</li>
          </ol>
        </div>
        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-3 border-2 border-primary-400">
          <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-1 text-sm">Ruk (30s)</h4>
          <p className="text-xs text-primary-800 dark:text-primary-200 mb-1">Autonomous agent with <strong>persistent identity + memory</strong>. Colleague, not chatbot.</p>
          <ul className="text-xs text-primary-800 dark:text-primary-200 space-y-0.5">
            <li>• Identity files • Semantic memory • Knowledge graph</li>
            <li>• Tools (code, issues, research) • Always-on 24/7</li>
            <li>• <strong>Technical:</strong> Claude, LanceDB, knowledge graph, 24/7</li>
          </ul>
          <p className="text-xs text-primary-800 dark:text-primary-200 mt-1 font-medium">→ 2x profit, 2x clients, 50% headcount</p>
          <p className="text-xs text-primary-600 dark:text-primary-400 italic">My role: architecture, process design, context layer, adoption</p>
        </div>
      </div>

      {/* Row 2: Nick's Background + Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-1 text-sm">Nick&apos;s Background</h4>
          <ul className="text-xs text-surface-600 dark:text-surface-400 space-y-0.5">
            <li>• Value Creation Data Team</li>
            <li>• Ex-TRIBE Head of Data (Melbourne)</li>
            <li>• Aussie, London since 2018</li>
            <li>• Hired 3x interims for AI eng</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1 text-sm">My Words</h4>
          <ul className="text-xs text-green-800 dark:text-green-200 space-y-0.5">
            <li>• Software-shaped problems</li>
            <li>• Metabolic rate</li>
            <li>• Orchestrators not engineers</li>
            <li>• High pain, high freq, low crit</li>
            <li>• Discover, diagnose, deliver</li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm">Hg Words</h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5">
            <li>• Systems of action</li>
            <li>• Re-founding</li>
            <li>• Process-first</li>
            <li>• Fire bullets, then cannonballs</li>
            <li>• Orchestrating agents</li>
          </ul>
        </div>
      </div>

      {/* Row 3: Key Stats + Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 text-sm">Key Stats</h4>
          <div className="grid grid-cols-2 gap-x-2 text-xs text-purple-800 dark:text-purple-200">
            <div>• 2x profit</div>
            <div>• 2x clients</div>
            <div>• 50% headcount</div>
            <div>• 2.3x velocity</div>
            <div>• 58+ portcos</div>
            <div>• 80+ Catalyst eng</div>
            <div>• $130m+ EBITDA uplift</div>
            <div>• 15+ AI products launched</div>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border-2 border-amber-400">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-sm">Questions for Nick</h4>
          <ol className="text-xs text-amber-800 dark:text-amber-200 space-y-0.5 list-decimal list-inside">
            <li>Where does AI-first stick vs struggle?</li>
            <li>Standardise vs let each find their path?</li>
            <li>Catalyst vs Value Creation handoff?</li>
            <li>Gap between AI hype and reality?</li>
            <li>Day-to-day for interims — embedded or central?</li>
            <li>Success at 90 days?</li>
          </ol>
        </div>
      </div>

      {/* Row 4: Kill */}
      <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1 text-sm">Kill</h4>
        <p className="text-xs text-red-800 dark:text-red-200">I guess • just • really • ultimately • overall • basically</p>
      </div>
    </div>
  );
}

export default function NickInterviewPage() {
  const [activeTab, setActiveTab] = useState('pov');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pov': return <AIFirstPOVTab />;
      case 'stories': return <BuilderStoriesTab />;
      case 'questions': return <QuestionsTab />;
      case 'cheatsheet': return <CheatSheetTab />;
      default: return <AIFirstPOVTab />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">
          <Badge variant="info">Nick Barrington</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          AI-First Engineering
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          Portfolio Value Creation — Data & AI
        </p>
      </div>

      {/* Tabs */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <a
          href="https://hgcapital.com/team/nick-barrington"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          View Nick&apos;s Hg Profile
        </a>
      </div>
    </div>
  );
}
