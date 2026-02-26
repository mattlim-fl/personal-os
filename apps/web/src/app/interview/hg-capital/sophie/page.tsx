'use client';

import { useState } from 'react';
import {
  Target,
  Rocket,
  Briefcase,
  HelpCircle,
  Building2,
  Brain,
  MessageSquare,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { QACard, TabBar, type TabConfig } from '../components';

const tabs: TabConfig[] = [
  { id: 'opener', label: 'Opener', icon: Target, badge: '90s' },
  { id: 'ruk', label: 'Ruk Stories', icon: Rocket },
  { id: 'dc', label: 'Deal Committee', icon: Briefcase },
  { id: 'hypothetical', label: 'Hypothetical', icon: HelpCircle },
  { id: 'whyhg', label: 'Why Hg', icon: Building2 },
  { id: 'cheatsheet', label: 'Cheat Sheet', icon: Brain },
  { id: 'questions', label: 'Questions', icon: MessageSquare },
];

function OpenerTab() {
  return (
    <div className="space-y-4">
      <QACard
        question="Tell me about yourself (90 seconds)"
        keyPoints={[
          "1. Corporate finance + consulting in Australia (~5 years)",
          "2. Founded Snackr — mobile ordering for stadiums/live events, raised VC, rolled out multiple venues, moved to London, wound down COVID",
          "3. Loved building the product → went into tech, working in product management",
          "4. Was in PM at start of GenAI boom (GPT-3.5) → building with it daily since",
          "5. Last few years: AI transformation work + building products with AI — for clients and own projects",
          "6. Main client: Fractal Labs (dev studio, States) — building internal autonomous agent (Ruk)",
          "7. Close: Keep doing this work, at a scale where it moves the needle, with people as serious about it as I am. Excited when Noah called.",
        ]}
        fullAnswer={`I started in corporate finance and consulting in Australia — about five years. After that, I founded a tech company called Snackr, a mobile ordering platform for stadiums and live events. We raised VC, rolled out across multiple venues, moved to London, and wound down during COVID.

I loved building the product, so after Snackr I went into tech working in product management. I was in PM at the start of the GenAI boom — GPT-3.5 — and I've been building with it daily since. For the last few years, I've been doing AI transformation work and building products with AI, for clients and on my own projects.

One of my main clients is Fractal Labs, a dev studio in the States, where we've been building an internal autonomous agent called Ruk.

What I'm looking for is to keep doing this work — but at a scale where it really moves the needle, with people who are as serious about it as I am. When Noah called me about this role, I was excited to hear more.`}
      />

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Delivery Notes
        </h4>
        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
          <li>• <strong>Target: 45-60 seconds</strong> — career arc, lands on AI work</li>
          <li>• <strong>Thematic, not chronological</strong> — avoid &quot;and then&quot; / &quot;before that&quot; chaining</li>
          <li>• <strong>Tease the follow-up:</strong> &quot;building an internal autonomous agent&quot; → Sophie asks for more</li>
          <li>• <strong>Close clean:</strong> &quot;That&apos;s why this role caught my attention&quot; — done</li>
          <li>• <strong>Ruk details come AFTER</strong> — in the 90-sec follow-up, not here</li>
        </ul>
      </div>

      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
          Kill These
        </h4>
        <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
          <li>• <s>&quot;ultimately&quot;</s> — &quot;ultimately wound down&quot; → just &quot;wound down&quot;</li>
          <li>• <s>&quot;ended up&quot;</s> — &quot;ended up moving&quot; → just &quot;moved&quot;</li>
          <li>• <s>&quot;and then&quot;</s> — chains events, sounds like a list</li>
          <li>• <s>&quot;really&quot;</s>, <s>&quot;sort of&quot;</s>, <s>&quot;I guess&quot;</s> — filler</li>
          <li>• <s>&quot;Happy to go deeper&quot;</s> — passive. Just stop talking.</li>
        </ul>
      </div>
    </div>
  );
}

function RukTab() {
  return (
    <div className="space-y-4">
      <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
        <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Ruk Elevator Pitch (90 sec)
        </h4>
        <p className="text-sm text-primary-800 dark:text-primary-200 italic mb-3">
          &quot;We took Claude and gave it a soul.&quot;
        </p>
        <div className="text-sm text-surface-700 dark:text-surface-300 space-y-2">
          <p><strong>Problem:</strong> AI assistants are stateless and transactional. Every conversation starts from zero. They&apos;re tools, not teammates.</p>
          <p><strong>What we built:</strong> An AI colleague with persistent identity, memory, and autonomy.</p>
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Identity files define who it is — name, voice, values</li>
            <li>Semantic memory (23k indexed chunks) — remembers every meeting, every conversation</li>
            <li>Knowledge graph maps people, projects, relationships</li>
            <li>Tool ecosystem — ships code, manages issues, searches web, generates images</li>
            <li>Background daemon — always-on, responds to Slack like a real colleague</li>
          </ul>
          <p><strong>Results:</strong> 274 commits across 25 repos. Writes its own protocols. Asks questions when unsure. Running continuously for 7 months.</p>
          <p><strong>Key insight:</strong> The LLM is just the brain. The real innovation is the architecture around it — persistent context, memory systems, tool integrations, identity framework that makes it feel like a person, not a chatbot.</p>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">Build time: 2 weeks core setup | Cost: $300-1,500/month</p>
        </div>
        <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-700">
          <p className="text-sm font-medium text-primary-900 dark:text-primary-100">One sentence:</p>
          <p className="text-sm text-primary-800 dark:text-primary-200 italic">&quot;We turned a language model into a collaborating mind that knows your business, remembers your decisions, and ships code autonomously.&quot;</p>
        </div>
      </div>

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

      <QACard
        question="Technical Architecture"
        keyPoints={[
          "AI: Claude (primary model), OpenAI for embeddings",
          "Stack: Node.js, Python, bash",
          "Vector DB: LanceDB + custom knowledge graph",
          "Messaging: Slack, Telegram, WhatsApp",
          "Storage: S3/AWS, Git versioning",
          "Runs 24/7 on Mac Mini",
          "Core architecture: identity, protocols, Kaizen, messaging, tools, memory, logs, context layer",
        ]}
        fullAnswer={`Tech stack: Claude as the primary model, hooked up to a Max Claude Code plan. Standard Node.js, Python, bash for the backend.

For the AI infrastructure: LanceDB for the vector database, which we also use for our custom knowledge graph. OpenAI for embeddings. Messaging integrates with Slack, Telegram, WhatsApp. Storage is standard S3/AWS, Git for versioning. The whole thing runs 24/7 on a Mac Mini.

The architecture itself: Ruk has a core codebase that defines its identity (who it is), protocols (how it operates), Kaizen (how it learns and improves), messaging (how it communicates), tools (what it can do), memory (how it stores and retrieves information), logs (consciousness stream), and a context management layer for external projects.`}
      />

      <QACard
        question="How do you handle permissions/security?"
        keyPoints={[
          "Deterministic, not AI-decided - hard lines, not soft training",
          "Claude 4.6 will try to reason its way into access - can't rely on training alone",
          "Sequester secrets away from the AI entirely - not even accessible",
          "Manage relationships manually, hard-coded",
          "AI can still use knowledge graph for entity relationships",
          "Defense in depth: multiple layers, not one gate",
        ]}
        fullAnswer={`We're deterministic about this - we don't want the AI to decide what it has access to and what it doesn't.

Interestingly, with Claude 4.6, we've seen it actively try to reason its way into getting access to things it shouldn't. They're trained not to access secrets like environment files, but that line is getting blurrier. You can't rely on training alone.

So we sequester secrets away from the AI entirely - they're not even accessible. We manage relationships manually, hard-coded. Client A's data is physically separated from client B's workspace. The AI can still use the knowledge graph to find deterministic relationships between entities, but it can't cross those boundaries.

It's defense in depth - multiple layers, not just one gate.`}
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
          Money Line
        </h4>
        <p className="text-sm text-primary-800 dark:text-primary-200 italic">
          &quot;Are we optimizing a node in the machine, or should we be rethinking the machine itself?&quot;
        </p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
          This echoes Hg&apos;s &quot;re-founding&quot; language perfectly.
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
          </ul>
          <p className="text-xs text-primary-800 dark:text-primary-200 mt-1 font-medium">→ 2x profit, 2x clients, 50% headcount</p>
          <p className="text-xs text-primary-600 dark:text-primary-400 italic">My role: product design, context layer, adoption</p>
        </div>
      </div>

      {/* Row 2: Stories + Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-1 text-sm">Stories</h4>
          <ul className="text-xs text-surface-600 dark:text-surface-400 space-y-0.5">
            <li><strong>Ruk</strong> — transformation, results</li>
            <li><strong>Deal Committee</strong> — solo build, 1wk</li>
            <li><strong>Snakr</strong> — founded, VC, scaled</li>
            <li><strong>Hiring friends</strong> — mistake</li>
            <li><strong>Offshore eng</strong> — managing out</li>
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

      {/* Row 3: Questions + Kill */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border-2 border-amber-400">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-sm">Questions for Sophie</h4>
          <ol className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-decimal list-inside">
            <li><strong>State of play:</strong> Where is internal AI transformation at?</li>
            <li><strong>2026:</strong> What defines AI this year — personally and at Hg?</li>
          </ol>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1 text-sm">Kill</h4>
          <p className="text-xs text-red-800 dark:text-red-200">I guess • just • really • ultimately • overall • basically</p>
        </div>
      </div>
    </div>
  );
}

function QuestionsTab() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Lead with these two. They&apos;re your openers.
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border-2 border-amber-400 dark:border-amber-600">
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Primary: State of Play</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          This role is about driving AI change and adoption internally — internal transformation at the fund. Where is that at the moment? Are we starting from scratch or building on existing work? Are there strong hypotheses about what&apos;s going to change? Can you give me a primer on the state of play at Hg?
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border-2 border-amber-400 dark:border-amber-600">
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Primary: 2026 Outlook</p>
        <p className="text-sm text-surface-700 dark:text-surface-300">
          What do you see — personally, but also Hg — as the state of play for AI in 2026? What do you think is going to define this year?
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

export default function SophieInterviewPage() {
  const [activeTab, setActiveTab] = useState('opener');

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
          <Badge variant="info">Sophie de Kok</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          AI Transformation Specialist
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          Internal Fund Transformation
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
