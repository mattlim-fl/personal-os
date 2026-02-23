'use client';

export default function CheatSheetPage() {
  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <div className="space-y-3">
        {/* Row 1: TMAY + Ruk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border-2 border-amber-400">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">👋 TMAY (60-90s)</h4>
            <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-decimal list-inside">
              <li>Finance + consulting Australia (5y)</li>
              <li>Founded Snakr → VC, London, wound down COVID</li>
              <li>Loved building → PM</li>
              <li>GenAI boom → <strong>building daily since</strong></li>
              <li>AI transformation + products</li>
              <li>Fractal Labs → Ruk</li>
              <li>Want: scale, needle-moving, serious people</li>
            </ol>
          </div>
          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-4 border-2 border-primary-400">
            <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">🤖 Ruk (30s)</h4>
            <p className="text-sm text-primary-800 dark:text-primary-200 mb-2">
              Autonomous agent with <strong>persistent identity + memory</strong>. Colleague, not chatbot.
            </p>
            <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-1">
              <li>• Identity files • Semantic memory • Knowledge graph</li>
              <li>• Tools (code, issues, research) • Always-on 24/7</li>
            </ul>
            <p className="text-sm text-primary-800 dark:text-primary-200 mt-2 font-medium">
              → 2x profit, 2x clients, 50% headcount
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400 italic">
              My role: product design, context layer, adoption
            </p>
          </div>
        </div>

        {/* Row 2: Stories + Language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-2">📚 Stories</h4>
            <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
              <li><strong>Ruk</strong> — transformation, results</li>
              <li><strong>Deal Committee</strong> — solo build, 1wk MVP</li>
              <li><strong>Snakr</strong> — founded, VC, scaled</li>
              <li><strong>Hiring friends</strong> — mistake, expectations</li>
              <li><strong>Offshore eng</strong> — managing out</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✓ My Words</h4>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• Software-shaped problems</li>
              <li>• Metabolic rate</li>
              <li>• Orchestrators not engineers</li>
              <li>• High pain, high freq, low crit</li>
              <li>• Discover, diagnose, deliver</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">✓ Hg Words</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Systems of action</li>
              <li>• Re-founding</li>
              <li>• Process-first</li>
              <li>• Fire bullets, then cannonballs</li>
              <li>• Orchestrating agents</li>
            </ul>
          </div>
        </div>

        {/* Row 3: Questions */}
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border-2 border-amber-400">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">❓ Questions for Sophie</h4>
          <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-decimal list-inside">
            <li><strong>State of play:</strong> Where is internal AI transformation at? Starting from scratch or building on existing work?</li>
            <li><strong>2026:</strong> What do you see defining AI this year — personally and at Hg?</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
