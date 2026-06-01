import type { Metadata } from 'next';
import Link from 'next/link';
import ZuZu from '@/components/ZuZu';

export const metadata: Metadata = {
  title: 'Privacy Policy — askZuZu',
  description:
    'AskZuZu is fully COPPA-compliant and never collects personal data from children. Read how we handle data transparently.',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionBadge({ n }: { n: number }) {
  return (
    <span className="shrink-0 w-9 h-9 rounded-full bg-zuzu-teal flex items-center justify-center text-white font-extrabold text-base">
      {n}
    </span>
  );
}

function SectionCard({
  n,
  title,
  accent = 'teal',
  children,
}: {
  n: number;
  title: string;
  accent?: 'teal' | 'amber';
  children: React.ReactNode;
}) {
  const border = accent === 'amber' ? 'border-amber-200' : 'border-zuzu-teal-bg';
  const badge  = accent === 'amber'
    ? 'bg-zuzu-amber text-white'
    : 'bg-zuzu-teal text-white';

  return (
    <div className={`bg-white rounded-3xl border-2 ${border} shadow-sm p-6 flex flex-col gap-4`}>
      <div className="flex items-center gap-3">
        <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-base ${badge}`}>
          {n}
        </span>
        <h2 className="text-slate-800 font-extrabold text-xl leading-tight">{title}</h2>
      </div>
      <div className="text-slate-600 font-semibold text-base leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 items-start">
      <span className="mt-2 shrink-0 w-2 h-2 rounded-full bg-zuzu-teal" />
      <span>{children}</span>
    </li>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-zuzu-teal font-extrabold">{children}</strong>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zuzu-bg px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Back link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zuzu-teal font-bold text-lg px-4 py-2 rounded-2xl hover:bg-zuzu-teal-bg transition-colors focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            ← Back to Chat
          </Link>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center gap-4 text-center">
          <ZuZu expression="idle" size="small" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zuzu-teal-dark leading-tight">
              AskZuZu Privacy Policy
            </h1>
            <span className="inline-block mt-2 px-4 py-1 rounded-full bg-zuzu-teal-bg text-zuzu-teal font-bold text-sm">
              Last Updated: June 2026
            </span>
          </div>
        </div>

        {/* Intro card */}
        <div className="bg-zuzu-teal-bg border-2 border-zuzu-teal-light rounded-3xl p-6 text-zuzu-teal-dark font-semibold text-base leading-relaxed">
          Welcome to AskZuZu! We take the privacy of children and peace of mind for parents incredibly seriously. AskZuZu is built from the ground up to comply fully with the{' '}
          <Strong>Children's Online Privacy Protection Act (COPPA)</Strong> and global youth privacy frameworks.
          <br /><br />
          Here is exactly how we handle data:
        </div>

        {/* Section 1 */}
        <SectionCard n={1} title="Zero Personal Data Collected">
          <p>
            We do not collect, request, or store any{' '}
            <Strong>Personally Identifiable Information (PII)</Strong> from children.
          </p>
          <ul className="flex flex-col gap-2">
            <Bullet>
              We <Strong>never</Strong> ask for names, email addresses, phone numbers, or physical locations.
            </Bullet>
            <Bullet>
              We <Strong>do not</Strong> log or track user IP addresses or unique hardware device serial numbers.
            </Bullet>
          </ul>
        </SectionCard>

        {/* Section 2 */}
        <SectionCard n={2} title="What We Log (Completely Anonymously)">
          <p>
            To understand if ZuZu is answering questions properly and to improve our educational quality, we log purely{' '}
            <Strong>anonymous metadata</Strong> into our server database:
          </p>
          <ul className="flex flex-col gap-2">
            <Bullet>The age bucket selected on the dial (e.g., 6 or 14).</Bullet>
            <Bullet>The text of the question asked.</Bullet>
            <Bullet>The text of ZuZu's response.</Bullet>
            <Bullet>A randomized, temporary session string (cleared when the app closes).</Bullet>
            <Bullet>Generalized device category (e.g., "mobile" or "desktop").</Bullet>
          </ul>
        </SectionCard>

        {/* Section 3 */}
        <SectionCard n={3} title="Data Safety Guardrails">
          <p>
            Before any question is processed by our secure AI backend (powered by the{' '}
            <Strong>Google Gemini API</Strong>), a local filter automatically scrubs out common patterns matching personal information — like accidentally typed phone numbers or addresses — to ensure complete safety.
          </p>
        </SectionCard>

        {/* Section 4 — amber accent */}
        <SectionCard n={4} title="AI Model Training Exclusion" accent="amber">
          <p>
            We do <Strong>not</Strong> permit children's questions or interactions to be used for secondary data profiling,{' '}
            <Strong>behavioral advertising</Strong>, or{' '}
            <Strong>AI model training</Strong>.
          </p>
        </SectionCard>

        {/* Section 5 */}
        <SectionCard n={5} title="Parental Rights">
          <p>
            Because we keep <Strong>zero personal identifiers or tracking cookies</Strong>, we have no way to link a specific question to a specific child or household.
          </p>
          <p>
            However, if you have any questions or feedback regarding our privacy architecture, you can contact us at:{' '}
            <a
              href="mailto:support@askzuzu.app"
              className="text-zuzu-teal font-extrabold underline underline-offset-2 hover:text-zuzu-teal-dark"
            >
              support@askzuzu.app
            </a>
          </p>
        </SectionCard>

        {/* Footer */}
        <footer className="text-center text-slate-400 font-semibold text-sm pb-4">
          © 2026 AskZuZu · Built with care for curious kids everywhere 💙
        </footer>

      </div>
    </div>
  );
}
