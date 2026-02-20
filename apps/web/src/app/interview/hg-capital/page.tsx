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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { PageHeader } from '@/components/layout';

interface ExpandableSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function ExpandableSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
          <span className="font-semibold text-surface-900 dark:text-surface-50">
            {title}
          </span>
          {badge && (
            <Badge variant="default" className="ml-2">
              {badge}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-surface-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-surface-400" />
        )}
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4 px-4 border-t border-surface-100 dark:border-surface-800">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

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

function QuoteBlock({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="bg-primary-50 dark:bg-primary-950/30 border-l-4 border-primary-500 p-4 rounded-r-lg my-4">
      <div className="flex gap-2">
        <Quote className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
        <div>
          <p className="text-surface-700 dark:text-surface-300 italic">{children}</p>
          {author && (
            <p className="text-sm text-surface-500 mt-2">— {author}</p>
          )}
        </div>
      </div>
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

export default function HgCapitalInterviewPage() {
  const [checklist, setChecklist] = useState({
    reviewBible: false,
    practiceIntro: false,
    prepareDealCommittee: false,
    reviewN8n: false,
    prepareQuestions: false,
    checkLinkedIn: false,
    planOutfit: false,
    checkRoute: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8 px-4">
      {/* Header */}
      <div className="mb-8">
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
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
              Prep Checklist
            </CardTitle>
            <Badge variant={completedCount === totalCount ? 'default' : 'secondary'}>
              {completedCount}/{totalCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <ChecklistItem
              checked={checklist.reviewBible}
              onToggle={() => toggleCheck('reviewBible')}
            >
              Review the full bible below
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.practiceIntro}
              onToggle={() => toggleCheck('practiceIntro')}
            >
              Practice your intro & Deal Committee story
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.prepareDealCommittee}
              onToggle={() => toggleCheck('prepareDealCommittee')}
            >
              Have Deal Committee demo ready (optional but powerful)
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.reviewN8n}
              onToggle={() => toggleCheck('reviewN8n')}
            >
              Review n8n basics (they mentioned it specifically)
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.prepareQuestions}
              onToggle={() => toggleCheck('prepareQuestions')}
            >
              Prepare 3-4 questions for Sophie
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.checkLinkedIn}
              onToggle={() => toggleCheck('checkLinkedIn')}
            >
              Check Sophie de Kok's LinkedIn
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.planOutfit}
              onToggle={() => toggleCheck('planOutfit')}
            >
              Plan outfit (smart casual — they're "tech company not PE")
            </ChecklistItem>
            <ChecklistItem
              checked={checklist.checkRoute}
              onToggle={() => toggleCheck('checkRoute')}
            >
              Check route to London Bridge
            </ChecklistItem>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-4">
        {/* The Fund */}
        <ExpandableSection title="The Fund" icon={Building2} defaultOpen badge="Know This">
          <div className="space-y-4 pt-4">
            <p className="text-surface-700 dark:text-surface-300">
              <strong>Hg</strong> is one of the world's largest software-focused PE investors.
              They describe themselves as "more like a tech company than a traditional PE firm" — and they mean it.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard label="AUM" value="$110bn+" icon={TrendingUp} />
              <StatCard label="Portfolio" value="58+ companies" icon={Building2} />
              <StatCard label="Portfolio EV" value="$185bn" icon={TrendingUp} />
            </div>

            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">
                Key Milestones to Know
              </h4>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li>• <strong>2000:</strong> Founded (spun out of Mercury Asset Management)</li>
                <li>• <strong>2006:</strong> Took Visma private — defining partnership model</li>
                <li>• <strong>2017:</strong> Rebranded from "Hg Capital" to "Hg" — signalling evolution</li>
                <li>• <strong>2024:</strong> Launched Hg Catalyst (AI incubator)</li>
                <li>• <strong>2025:</strong> Reached $100bn AUM, 25th anniversary</li>
              </ul>
            </div>

            <QuoteBlock author="Their culture">
              Curious, entrepreneurial, collaborative, successful, humble
            </QuoteBlock>
          </div>
        </ExpandableSection>

        {/* Hg Catalyst */}
        <ExpandableSection title="Hg Catalyst — The AI Incubator" icon={Rocket} badge="Important">
          <div className="space-y-4 pt-4">
            <p className="text-surface-700 dark:text-surface-300">
              Catalyst is their AI product incubator — 80+ engineers/PMs/designers who embed
              directly inside portfolio companies to build production-grade AI products.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Team Size" value="80+" icon={Users} />
              <StatCard label="Products" value="15+" icon={Zap} />
              <StatCard label="EBITDA Lift" value="$130m+" icon={TrendingUp} />
              <StatCard label="Dev Velocity" value="~2x" icon={Rocket} />
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Key Distinction
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Catalyst builds <strong>products that ship and generate revenue</strong>, not just pilots.
                "Real world products that drive revenue growth" — not prototypes.
              </p>
            </div>

            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">
                Products They've Shipped
              </h4>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li>• <strong>GTreasury → GSmart AI:</strong> Agentic treasury product. Led to $1bn exit to Ripple.</li>
                <li>• <strong>CINC Systems → Cephai+:</strong> AI for property management</li>
                <li>• <strong>FE fundinfo → Nexus AI:</strong> Investment professional enablement</li>
                <li>• <strong>Ncontracts → Ntelligence:</strong> Regulatory compliance AI</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        {/* Key Frameworks */}
        <ExpandableSection title="Their Strategic Frameworks" icon={Brain} badge="Use This Language">
          <div className="space-y-4 pt-4">
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
                  Other Key Terms
                </h4>
                <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
                  <li>• <strong>Re-founding:</strong> Fundamental restructure for AI</li>
                  <li>• <strong>Process-first:</strong> Fix workflows before tools</li>
                  <li>• <strong>Fire bullets, then cannonballs:</strong> Experiment, then scale</li>
                  <li>• <strong>Author to editor:</strong> Human role shift</li>
                </ul>
              </div>
            </div>

            <QuoteBlock author="Their mantra">
              AI doesn't fix broken processes or bad data — it amplifies them.
            </QuoteBlock>
          </div>
        </ExpandableSection>

        {/* Key People */}
        <ExpandableSection title="Key People" icon={Users}>
          <div className="space-y-3 pt-4">
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50">Sophie de Kok</h4>
              <p className="text-sm text-surface-500">Your interviewer — Leading internal AI enablement</p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50">James Cope</h4>
              <p className="text-sm text-surface-500">Business Systems & Transformation Specialist — likely who you'd work with</p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50">Lloyd Hilton</h4>
              <p className="text-sm text-surface-500">Head of Hg Catalyst</p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50">Matthew Brockman</h4>
              <p className="text-sm text-surface-500">Managing Partner — hosts Orbit podcast, key AI voice</p>
            </div>
          </div>
        </ExpandableSection>

        {/* Your Story */}
        <ExpandableSection title="Your Story" icon={Target} defaultOpen badge="Practice This">
          <div className="space-y-4 pt-4">
            <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4">
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                Your Positioning
              </h4>
              <p className="text-sm text-primary-800 dark:text-primary-200">
                You're a product leader who's been <strong>building AI transformation systems, not just talking about it</strong>.
                You understand both the strategic level (how AI changes how organisations operate) and the execution level
                (you can actually build and ship).
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border-2 border-primary-300 dark:border-primary-700">
              <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center gap-2">
                🎯 Ruk — Your Headline Story (Transformation)
              </h4>
              <p className="text-sm text-primary-800 dark:text-primary-200 mb-3">
                "At Fractal, I've been part of building Ruk — an autonomous agent connected to all our company context..."
              </p>
              <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
                <li>• <strong>What it is:</strong> Company-aware autonomous agent — not just code, but Slack, email, meeting transcripts, all context</li>
                <li>• <strong>What it does:</strong> Scopes work, spins up sub-agents and microservices, delivers code, creates PRs for human review</li>
                <li>• <strong>Why it matters:</strong> It's exactly Hg's "orchestrating agents" vision — humans set direction, agent executes across workstreams</li>
                <li>• <strong>Your role:</strong> Product leadership on an AI transformation that's changing how the company operates</li>
              </ul>
            </div>

            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">
                Deal Committee — Your "I Can Build" Story
              </h4>
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                "I've also shipped my own AI product — solo build, production users, revenue..."
              </p>
              <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
                <li>• <strong>Problem:</strong> Searchers spend hours reading CIMs, financials, market reports</li>
                <li>• <strong>Your role:</strong> Sole builder. Claude Code as pair programmer. Vibe coding approach.</li>
                <li>• <strong>What it does:</strong> NL queries over documents, AI-generated investment memos</li>
                <li>• <strong>Result:</strong> Live with paying users. 4-5 hours saved per deal on screening.</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                On n8n / Low-Code
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Be honest: "Haven't used n8n professionally yet, but I've worked with similar visual workflow builders.
                The mental model transfers — triggers, actions, conditionals, APIs. I'd be productive within hours."
              </p>
            </div>
          </div>
        </ExpandableSection>

        {/* Questions to Ask */}
        <ExpandableSection title="Questions to Ask Sophie" icon={MessageSquare}>
          <div className="space-y-3 pt-4">
            <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Understanding the Scope</p>
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "What's the current state of AI adoption internally at Hg? Are we starting from scratch or building on existing work?"
              </p>
            </div>
            <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Discovery vs Execution</p>
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "Are there specific functions or use cases already identified, or is part of this role discovering where the opportunities are?"
              </p>
            </div>
            <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">Role Shape</p>
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "How much of this is greenfield discovery vs executing on a roadmap that already exists?"
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "What does success look like at 90 days for this role?"
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "Which functions are highest priority for AI transformation right now?"
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "How does internal transformation connect with what Catalyst does for portfolio companies?"
              </p>
            </div>
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4">
              <p className="text-sm text-surface-700 dark:text-surface-300">
                "What's been the biggest surprise or learning from AI transformation work so far?"
              </p>
            </div>
          </div>
        </ExpandableSection>

        {/* Why Hg */}
        <ExpandableSection title="Why Hg — Your Answer" icon={Sparkles}>
          <div className="space-y-4 pt-4">
            <QuoteBlock>
              Hg is doing AI transformation at a scale and pace that's rare. The Catalyst model — actually
              embedding teams to build, not just advise — is how you get real outcomes. And the internal
              transformation work is interesting because it's about practising what you preach. If you're
              going to help portfolio companies transform, you should be transforming yourselves first.
              That's the kind of environment where I learn and deliver my best work.
            </QuoteBlock>
          </div>
        </ExpandableSection>
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
