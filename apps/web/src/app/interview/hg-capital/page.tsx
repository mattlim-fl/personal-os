'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  Zap,
  Target,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  PoundSterling,
  Brain,
  Lightbulb,
  Quote,
  ExternalLink,
  Rocket,
  BookOpen,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-primary-500" />
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{value}</p>
    </div>
  );
}

function ChecklistItem({
  children,
  checked,
  onToggle,
}: {
  children: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 w-5 h-5 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
      />
      <span
        className={`text-sm ${
          checked
            ? 'text-surface-400 line-through'
            : 'text-surface-700 dark:text-surface-300'
        }`}
      >
        {children}
      </span>
    </label>
  );
}

interface QACardProps {
  question: string;
  keyPoints: string[];
  fullAnswer: string;
  defaultOpen?: boolean;
}

function QACard({ question, keyPoints, fullAnswer, defaultOpen = false }: QACardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50">
            {question}
          </h4>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-surface-400 flex-shrink-0 mt-0.5" />
          ) : (
            <ChevronRight className="w-5 h-5 text-surface-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
        <ul className="mt-3 space-y-1 text-sm text-surface-600 dark:text-surface-400">
          {keyPoints.map((point, i) => (
            <li key={i}>• {point}</li>
          ))}
        </ul>
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4 border-t border-surface-100 dark:border-surface-800">
          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 mt-3">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">Full Answer</p>
            <div className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-line">
              {fullAnswer}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const tabs: TabConfig[] = [
  { id: 'opener', label: 'Opener', icon: Target, badge: '90s' },
  { id: 'ruk', label: 'Ruk Stories', icon: Rocket },
  { id: 'dc', label: 'Deal Committee', icon: Briefcase },
  { id: 'hypothetical', label: 'Hypothetical', icon: HelpCircle },
  { id: 'whyhg', label: 'Why Hg', icon: Building2 },
  { id: 'cheatsheet', label: 'Cheat Sheet', icon: Brain },
  { id: 'questions', label: 'Questions', icon: MessageSquare },
];

function TabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  return (
    <div className="border-b border-surface-200 dark:border-surface-700 mb-6 overflow-x-auto">
      <nav className="flex gap-1 min-w-max pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${isActive 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs py-0">
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Tab Content Components
function OpenerTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Tell me about yourself (90 seconds)"
        keyPoints={[
          "1. Last couple years: building AI products with AI, consulting on product + implementation",
          "2. Fractal Labs: restructured entire org around AI-native ops (tech, culture, ways of working)",
          "3. Built Ruk (autonomous agent) → 2.5x velocity, 2x profit, 50% headcount, 2x projects",
          "4. On the side: Deal Committee — agentic tool for M&A searchers",
          "5. Before: founder (mobile ordering, VC, wound down COVID) + corporate finance/strategy",
          "6. Close: Noah called, it's moving fast, this is the work I want to keep doing",
        ]}
        fullAnswer={`Over the last couple of years, I've been building AI products with AI — some for clients, some of my own — and consulting on the product and implementation side.

One of my main clients is Fractal Labs, a software development studio. We've restructured the entire org around AI-native development and operations. Not just the technology — the culture, the ways of working. We went back to first principles and rebuilt from the ground up.

Part of that was building an internal autonomous agent called Ruk. The key thing is that it's proactive, not reactive — it's not waiting for prompts, it's picking up work, coordinating across the team, managing context across projects. That's been the real unlock. Our developers have shifted from being engineers to being orchestrators — they're directing and reviewing, not just writing code.

The results: 2.5x increase in development velocity, doubled profit margin, 50% headcount reduction, and we're taking on twice as many projects as we were in Q4 2025.

On the side, I'm building Deal Committee — an agentic tool for M&A searchers.

Before this, I was a founder — raised VC for a mobile ordering startup, scaled across multiple venues, wound down during COVID. Before that, corporate finance and strategy at a leading boutique consultancy in Australia.

When I saw this role and heard about what you're doing with Catalyst in the portfolio, it made sense. That's the kind of work I want to keep doing.`}
      />

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Delivery Notes
        </h4>
        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
          <li>• <strong>Kill the filler:</strong> No "ultimately", "sort of", "really", "I guess"</li>
          <li>• <strong>Own the numbers:</strong> "50%" not "I think almost 50%"</li>
          <li>• <strong>"First principles"</strong> echoes Hg's "re-founding" language</li>
          <li>• <strong>Land the close:</strong> "That's why I'm here" — short, intentional</li>
          <li>• <strong>Keep to ~90 seconds</strong> — leave room for Sophie to steer</li>
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
          ❌ Common Mistakes (From Practice)
        </h4>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• <s>"The headline is..."</s> — sounds like a TED talk, just go straight in</li>
          <li>• <s>"it felt like exactly where I should be"</s> — corny, keep it natural</li>
          <li>• <s>"really"</s> — kills certainty ("not really just", "we really had to")</li>
          <li>• <s>"as well"</s> — filler at end of sentences</li>
          <li>• <s>"So I'm really excited to jump into it. Thanks!"</s> — too eager, let it breathe</li>
          <li>• <s>"Happy to go deeper"</s> — passive, weak close</li>
        </ul>
      </div>
    </div>
  );
}

function RukTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Ruk Story - Main Narrative"
        keyPoints={[
          "Situation: Saw agentic AI would change how work gets done - wanted to push it",
          "Task: Efficiency + free up time for creative work; take on more clients",
          "Approach: First principles, mapped all processes (all functions), identified where agents add value",
          "Built Ruk: Started small, iterated; now builds on itself with human-in-the-loop",
          "Result: 2x profit, 2x clients, 50% headcount; team doing more interesting work",
        ]}
        fullAnswer={`Situation: We saw agentic AI was not just about coding faster - it was going to fundamentally change how work gets done. We wanted to see how far we could push it.

Task: The goal was twofold: efficiency, yes - do more with less - but also free up time for higher-value creative work.

Approach: We went back to first principles. Mapped out all our processes across every function. Identified where proactive agentic activity could add value. That led to building Ruk. Started small, iterated constantly. Now Ruk actually builds on itself - we provide feedback, it improves its own capabilities.

Result: Doubled profit margin, doubled the number of clients, halved headcount. The team is doing more interesting work now - less grunt, more thinking.`}
        defaultOpen
      />

      <QACard
        question="What was your specific role?"
        keyPoints={[
          "End-to-end: partnered on architecture, owned process design",
          "Mapped which workflows to target first",
          "Built context layer (agent understands the business)",
          "Drove adoption across team",
          "Key: process-first mindset - re-founded how work gets done",
          "Result: 2x profit, 50% headcount, 2x clients",
        ]}
        fullAnswer={`My role was end-to-end. I partnered on the architecture decisions, but I owned the process design piece - mapping out which workflows to target first, what the human-in-the-loop checkpoints should be, how to sequence the rollout.

I also built the context layer - the part that lets Ruk understand the business, not just execute tasks. That's where domain knowledge lives.

And I drove adoption across the team. The technical build was actually the easier part. Getting people to change how they conceptualize their work - that was harder.

The key was taking a process-first mindset. We didn't bolt AI onto existing workflows. We re-founded how the work gets done. That's why the results are what they are: 2x profit, 50% headcount, 2x clients.`}
      />

      <QACard
        question="What results have you seen?"
        keyPoints={[
          "Numbers: 2.3x velocity, 50% headcount, 2x projects",
          "Bigger result: how the work changed",
          "Developers became orchestrators (reviewing output, handling edge cases)",
          "Mindset shift: 'how do I build this' → 'how do I get this built'",
          "That shift is harder than tooling - but where the leverage is",
        ]}
        fullAnswer={`On the numbers side: 2.3x increase in velocity, we have halved our headcount, and we are managing double the projects we were before.

But honestly, the bigger result is how the work has changed. Our developers are not really coding in the traditional sense anymore - they are orchestrating agents, reviewing output, stepping in for the bits the AI cannot handle. It is a different job.

The mindset shift from "how do I build this" to "how do I get this built" - that has been harder than any of the tooling, but it is where the real leverage comes from.`}
      />

      <QACard
        question="What challenges did you face?"
        keyPoints={[
          "Technical: Context management UX (not architecture)",
          "Users need confidence they're getting right context at right time",
          "Building easier than making it legible - still not fully solved",
          "Cultural: 'Enhancement not replacement' - but replacement is real",
          "Can't BS it - honesty made adoption easier",
          "Some roles change fundamentally; leverage goes up for those who adapt",
        ]}
        fullAnswer={`Two main challenges.

The technical one was context management - not so much the architecture, although that does get complex as you scale, but more the UX of it. When someone is interacting with Ruk, they need to feel confident they are getting the right context at the right time. Building the system was actually easier than making it legible to users. That is still not fully solved, honestly.

The cultural challenge was messaging. "Enhancement, not replacement" is what you want to say, but there is a degree of replacement that is real and people sense it. You cannot BS that. We landed on being honest - some roles will change fundamentally, but the leverage goes up for everyone who adapts. That honesty actually made adoption easier.`}
      />

      <QACard
        question="How do you handle when AI makes mistakes?"
        keyPoints={[
          "Two parts: preventing mistakes + handling them",
          "Prevention: Map criticality / blast radius across workflow",
          "High-stakes decisions: human or deterministic code, not AI final call",
          "AI is a node, not always the endpoint - process-first mindset",
          "When mistakes happen: treat as learning moment, debug like code",
          "Mindset: AI as living system that evolves, not static tool",
        ]}
        fullAnswer={`There are two parts to this - preventing mistakes and handling them when they happen.

On prevention: we map criticality across the workflow. Where is the blast radius if AI gets it wrong? High-stakes decisions should not have AI making the final call - maybe it is doing the prep work, structuring data, generating options, but a human or deterministic code handles the output. AI is a node in the system, not always the endpoint.

When mistakes do happen - and they will - it is about culture. The instinct is to dismiss the tool entirely. What we try to do instead is treat it as a learning moment: why did it fail? Was it a context problem, a prompt problem, a model limitation? You debug it like you would debug code.`}
      />

      <QACard
        question="What would you do differently?"
        keyPoints={[
          "Apply product rigor from day one",
          "Normal approach: outcomes → problems → falsifiable hypotheses → metrics",
          "Ruk started as loose experimentation, evolved organically",
          "Worked, but measured success on vibes not hard metrics",
          "Would treat as proper product from start - structured approach enables speed",
        ]}
        fullAnswer={`Honestly? I would apply the same rigor I use for product work from day one.

My normal approach is structured: understand the outcome you are driving, map the problems you are solving, set falsifiable hypotheses, attach metrics so you know if you are succeeding or failing.

With Ruk, because it started as loose internal experimentation and evolved into a formalized project organically, we skipped that structure early on. It worked - clearly - but I was measuring success on vibes rather than hard metrics.

If I did it again, I would treat it as a proper product from the start. The structured approach is not slower - it actually lets you move faster because you know what you are testing and when to pivot.`}
      />
    </div>
  );
}

function DealCommitteeTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Deal Committee - Main Story"
        keyPoints={[
          "Solo build, end-to-end - AI co-pilot for acquiring small businesses",
          "Problem: Searchers spend hours on manual due diligence; brokers overwhelmed",
          "Solution: Chrome extension import, instant analysis, scoring vs criteria",
          "AI board evaluates from different angles (lender, equity, thesis)",
          "Lightweight CRM builds context over time",
          "Built MVP in 1 week (Claude Code, vibe coding)",
          "Live: dozens of active users, couple paying, no real GTM yet",
        ]}
        fullAnswer={`Deal Committee is something I built solo, end-to-end - it is an AI co-pilot for people acquiring small businesses.

The problem: acquisition searchers spend hours doing manual due diligence - reading CIMs, teasers, financials - before they can even form a view on whether a deal is worth pursuing. Brokers are overwhelmed, tasks slip through the cracks, and searchers do not have a system to manage their pipeline.

So I built a tool that lets you import deals via a Chrome extension or upload documents directly, and it gives you instant analysis, scoring against your investment criteria, and research on the business. There is also an AI board that evaluates deals from different angles - lender, equity partner, your own thesis - so you can stress-test before you commit. Plus a lightweight CRM that builds context over time.

I built the MVP in a week using Claude Code - vibe coding approach, just me and the agent. Deployed in December. It is live, dozens of active users, a couple paying, and I have not done any real go-to-market yet.`}
        defaultOpen
      />

      <QACard
        question="Why this space? (ETA/Search Funds)"
        keyPoints={[
          "Genuine interest for a few years - through friends in the ETA space",
          "Commercial logic: startup = brutal; acquiring cash-flow-positive = different risk profile",
          "Macro opportunity: Tens of millions of boomers retiring - 43% of businesses will close",
          "No succession plan = market inefficiency",
          "Opportunity: bring AI into existing business and improve it",
          "Long-term interest, not doing tomorrow - but building for future self",
        ]}
        fullAnswer={`It has been a genuine interest for a few years now - I got into it through friends in the ETA space, and it has grown from there.

What appeals to me is the commercial logic. I have done the startup thing, building revenue from nothing, and it can be brutal. Acquiring an existing cash-flow-positive business is a different risk profile - you are buying something that already works.

The macro opportunity is what is really compelling. Tens of millions of baby boomers retiring, and something like 43% of their businesses will just close because there is no succession plan. That is a massive market inefficiency. And for someone who can bring AI into an existing business and improve it, there is real opportunity there.

Building Deal Committee means I understand the users deeply - I am essentially building for a future version of myself. And it will make some money on the side as it goes.`}
      />

      <QACard
        question="What is the tech stack?"
        keyPoints={[
          "Standard modern stack: TypeScript, React, Supabase, Netlify",
          "AI layer: OpenAI agent builder + vector stores + Claude via API",
          "Codebase optimized for agentic dev (Claude MD files, structured docs)",
          "Own agent gathers Stripe + PostHog data autonomously",
          "Spectrum: between vibe coding and hands-on (in the architecture)",
          "MVP: ~1 week part-time (Christmas)",
          "Real unlock: AI to build + shape direction + architecture",
        ]}
        fullAnswer={`Pretty standard modern stack - TypeScript, React, Supabase on the backend for auth and data, deployed on Netlify.

The AI layer is a mix: OpenAI agent builder with vector stores for document retrieval, plus Claude via API for analysis, reasoning, and commentary.

The interesting bit is how I built it. The whole codebase is optimized for agentic development - Claude MD files, structured documentation the AI can navigate, design systems, entity relationships, the PRD with the outcomes we are driving. It all feeds into my own agent that gathers data from Stripe and PostHog to track performance autonomously.

I sit somewhere on the spectrum between vibe coding and hands-on coding - Claude Code is my main pair programmer, but I am in the architecture, not just prompting.

MVP was about a week of part-time work over Christmas. The real unlock is not just using AI in the product - it is using AI to build, to shape direction, to be actively involved in the architecture. Orchestrating that agent layer to deliver not just code, but outcomes.`}
      />

      <QACard
        question="What have you learned from users?"
        keyPoints={[
          "Everyone had cobbled-together workflow (ChatGPT + spreadsheets + docs)",
          "Expected problem: analysis. Real problem: context management",
          "Users capable of uploading docs - pain was organizing/navigating",
          "Hundreds of ChatGPT projects, context bleeding everywhere",
          "DC clicked: sequestered context windows per deal",
          "Other learning: workflow management (basic CRM) - initially discounted",
          "Meta-lesson: Start with workflow, not AI. AI = infrastructure; workflow = product",
        ]}
        fullAnswer={`Everyone had their own cobbled-together workflow - ChatGPT or Claude plus spreadsheets plus docs. What I expected to be the problem was analysis, and that is partly true. But digging deeper, these users were capable enough to upload documents and get answers. The real pain was context management.

They would create a new ChatGPT project for every deal, end up with hundreds of them, and could not navigate or connect the dots. Context was bleeding everywhere. That is where Deal Committee clicked - each deal gets its own sequestered context window, separate from your user context, your buy box criteria, everything.

The other learning was simpler: workflow management. A basic CRM to track deal status, see what needs follow-up, get prompted when to push on a seller. I initially discounted it - it is a software problem, not an AI problem. But it turned out to be core.

The meta-lesson: start with the workflow, not the AI. The AI is infrastructure; the workflow is the product.`}
      />
    </div>
  );
}

function HypotheticalTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="How would you approach AI transformation in Finance/FP&A?"
        keyPoints={[
          "1. Research - understand the function (use AI to get up to speed)",
          "2. Talk to people - processes, pain points, KPIs",
          "3. Map workflows - from outcomes backwards",
          "4. Prioritize - impact vs effort",
          "5. Strategic pause - optimize node vs rethink machine (re-founding)",
          "6. Validate - pressure-test with team",
          "7. Bet - falsifiable hypotheses, small bets, iterate, scale",
        ]}
        fullAnswer={`First, I would do my homework. I have some finance background, but FP&A at a fund is its own world. I would research the function - what outcomes it drives, how teams are structured, what good looks like - and I would use AI to get up to speed fast.

Then I would talk to the people doing the work. Understand their processes, their pain points, what they are measured on. You cannot map what you do not understand.

From there, I would map the workflows - start from the outcomes they are driving and work backwards through the process. Once that is visible, you can identify opportunities. I use a simple impact-versus-effort lens: what is high value and low friction to change?

But here is where it gets strategic. Before jumping to solutions, I would step back and ask: are we optimizing a node in the machine, or should we be rethinking the machine itself? That is the difference between incremental improvement and re-founding the function.

Then I would pressure-test that map with the team. Develop some falsifiable hypotheses. Place small bets on what we think will work, measure, iterate. Start narrow, prove value, then scale.`}
        defaultOpen
      />

      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4">
        <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
          💡 Money Line
        </h4>
        <p className="text-sm text-primary-800 dark:text-primary-200 italic">
          "Are we optimizing a node in the machine, or should we be rethinking the machine itself?"
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
          This echoes Hg's "re-founding" language perfectly.
        </p>
      </div>
    </div>
  );
}

function WhyHgTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Why Hg? Why this role?"
        keyPoints={[
          "Hg is serious about AI - Catalyst proves it (80+ engineers, real products)",
          "Internal role = they practice what they preach",
          "Direct extension of Fractal work, but completely different scale",
          "Hg touches 50+ portfolio companies across industries",
          "Compare notes with teams doing this across sectors → keep getting better",
          "Bigger draw: impact. Current work is small. Hg has scale + reach",
          "Drive change that matters - across critical industries",
        ]}
        fullAnswer={`A few things.

First, Hg is clearly serious about AI transformation - not just talking about it, but actually deploying it. Catalyst is not a pilot program; it is 80+ engineers shipping real products into portfolio companies. That tells me the internal culture matches. This role exists because they are applying the same thinking to themselves.

Second, it is a direct extension of what I have been doing at Fractal - but at a completely different scale. I have restructured one org around AI-native operations. Hg touches 50+ portfolio companies across industries I do not get exposure to in my current day-to-day. The chance to apply what I have learned, see how it translates to different contexts, and compare notes with teams doing this across sectors - that is where I keep getting better.

But honestly, the bigger draw is impact. What I am doing now works, but it is small. Hg has the scale and the reach to drive change that actually matters - not just in one company, but across critical industries. That is the opportunity I am after.`}
        defaultOpen
      />
    </div>
  );
}

function CheatSheetTab() {
  return (
    <div className="space-y-4">
      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4">
        <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
          🎯 Systems of Record → Systems of Action
        </h4>
        <p className="text-sm text-primary-800 dark:text-primary-200">
          THE key framing. Old software stores data ("automating filing cabinets").
          AI-enabled software <strong>does the work itself</strong>. Value accrues where decisions and actions happen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">
            The Four Ds
          </h4>
          <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
            <li>• <strong>Data:</strong> Proprietary datasets</li>
            <li>• <strong>Domain:</strong> Deep vertical expertise</li>
            <li>• <strong>Distribution:</strong> Customer relationships</li>
            <li>• <strong>Deterministic:</strong> Mission-critical accuracy</li>
          </ul>
        </div>
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Key Terms
          </h4>
          <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
            <li>• <strong>Re-founding:</strong> Fundamental restructure for AI</li>
            <li>• <strong>Process-first:</strong> Fix workflows before tools</li>
            <li>• <strong>Fire bullets, then cannonballs:</strong> Experiment, then scale</li>
            <li>• <strong>Author to editor:</strong> Human role shift</li>
          </ul>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Language Cheat Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-medium text-green-600 dark:text-green-400">✓ Use</div>
            <div className="font-medium text-red-600 dark:text-red-400">✗ Avoid</div>
            
            <div>Systems of action</div>
            <div className="text-surface-500">Just "AI features"</div>
            
            <div>Re-founding</div>
            <div className="text-surface-500">"Adding AI"</div>
            
            <div>Process-first</div>
            <div className="text-surface-500">"Tool-first"</div>
            
            <div>Agentic</div>
            <div className="text-surface-500">"Copilot"</div>
            
            <div>Fire bullets, then cannonballs</div>
            <div className="text-surface-500">"Big bang rollout"</div>
            
            <div>Author to editor</div>
            <div className="text-surface-500">"AI replacement"</div>
            
            <div>Orchestrating agents</div>
            <div className="text-surface-500">"Automating tasks"</div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          On n8n / Low-Code
        </h4>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Be honest: "Haven't used n8n professionally yet, but I've worked with similar visual workflow builders.
          The mental model transfers — triggers, actions, conditionals, APIs. I'd be productive within hours."
        </p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
        <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">
          💰 Money Lines to Land Cleanly
        </h4>
        <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
          <li>• "2x profit, 50% headcount, 2x clients"</li>
          <li>• "Orchestrating agents to deliver outcomes, not just code"</li>
          <li>• "Are we optimizing a node, or rethinking the machine itself?"</li>
          <li>• "The AI is infrastructure; the workflow is the product"</li>
        </ul>
      </div>
    </div>
  );
}

function QuestionsTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Ask the scoping questions first to understand what you're walking into.
      </p>
      
      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Understanding Scope</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          What is the current state of AI adoption internally? Starting from scratch or building on existing work?
        </p>
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Discovery vs Execution</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          Are there specific use cases identified, or is part of this role discovering where the opportunities are?
        </p>
      </div>
      
      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Success Metrics</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          What does success look like at 90 days?
        </p>
      </div>
      
      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Priorities</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          Which functions are highest priority for transformation right now?
        </p>
      </div>
      
      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Internal vs External</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          How does internal transformation connect with what Catalyst does for portfolio companies?
        </p>
      </div>
    </div>
  );
}

export default function HgCapitalInterviewPage() {
  const [activeTab, setActiveTab] = useState('opener');
  const [checklist, setChecklist] = useState({
    reviewTabs: false,
    practiceOpener: false,
    practiceRuk: false,
    practiceDC: false,
    reviewN8n: false,
    prepareQuestions: false,
    checkLinkedIn: false,
    checkRoute: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'opener': return <OpenerTab />;
      case 'ruk': return <RukTab />;
      case 'dc': return <DealCommitteeTab />;
      case 'hypothetical': return <HypotheticalTab />;
      case 'whyhg': return <WhyHgTab />;
      case 'cheatsheet': return <CheatSheetTab />;
      case 'questions': return <QuestionsTab />;
      default: return <OpenerTab />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          Interview Prep
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          Hg Capital
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          AI Transformation Specialist — Internal Fund Transformation
        </p>
      </div>

      {/* Quick Facts */}
      <Card className="mb-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/50 dark:to-primary-900/30 border-primary-200 dark:border-primary-800">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Rate" value="£1,200/day" icon={PoundSterling} />
            <StatCard label="Duration" value="3+ months" icon={Clock} />
            <StatCard label="Location" value="London Bridge" icon={MapPin} />
            <StatCard label="Days/Week" value="3-4 in office" icon={Building2} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Inside IR35</Badge>
            <Badge variant="default">Likely Extension</Badge>
            <Badge variant="default">Perm Possible</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Prep Checklist */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
              Prep Checklist
            </CardTitle>
            <Badge variant={completedCount === totalCount ? 'default' : 'secondary'}>
              {completedCount}/{totalCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ChecklistItem checked={checklist.reviewTabs} onToggle={() => toggleCheck('reviewTabs')}>
              Review all tabs below
            </ChecklistItem>
            <ChecklistItem checked={checklist.practiceOpener} onToggle={() => toggleCheck('practiceOpener')}>
              Practice opener out loud (90 sec)
            </ChecklistItem>
            <ChecklistItem checked={checklist.practiceRuk} onToggle={() => toggleCheck('practiceRuk')}>
              Practice Ruk story + follow-ups
            </ChecklistItem>
            <ChecklistItem checked={checklist.practiceDC} onToggle={() => toggleCheck('practiceDC')}>
              Practice Deal Committee story
            </ChecklistItem>
            <ChecklistItem checked={checklist.reviewN8n} onToggle={() => toggleCheck('reviewN8n')}>
              Review n8n basics (20 mins)
            </ChecklistItem>
            <ChecklistItem checked={checklist.prepareQuestions} onToggle={() => toggleCheck('prepareQuestions')}>
              Prepare 3-4 questions for Sophie
            </ChecklistItem>
            <ChecklistItem checked={checklist.checkLinkedIn} onToggle={() => toggleCheck('checkLinkedIn')}>
              Check Sophie de Kok's LinkedIn
            </ChecklistItem>
            <ChecklistItem checked={checklist.checkRoute} onToggle={() => toggleCheck('checkRoute')}>
              Check route to London Bridge
            </ChecklistItem>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <a
          href="https://hgcapital.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Visit hgcapital.com
        </a>
      </div>
    </div>
  );
}
