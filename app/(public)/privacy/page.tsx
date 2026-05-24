import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <Shield className="h-6 w-6 text-brand-200" />
        <h1 className="text-xl font-semibold">Privacy &amp; trust</h1>
        <p className="text-sm text-brand-100">
          How MyTools protects your information. Written in plain language.
        </p>
      </header>

      <article className="space-y-6 rounded-xl border border-brand-100 bg-white/90 p-5 text-sm text-slate-800 shadow-soft">
        <section>
          <h2 className="font-semibold text-slate-900">What this app collects</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            <li><strong>Without an account:</strong> nothing. You can browse the full directory, read articles, and use the Emergency Card without creating an account or being tracked.</li>
            <li><strong>With an account:</strong> the nickname and PIN you choose, optional contact info (encrypted), and optional demographics (gender, age, province, how you heard about the app, why you use it).</li>
            <li><strong>Search terms:</strong> if you search for something and no results appear, the search term is logged anonymously to help MRI add missing services. No user identity is attached.</li>
            <li><strong>Analytics:</strong> aggregate page views via a self-hosted system (Umami). No IP addresses, no cookies, no device fingerprints, no cross-session tracking.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">What is encrypted</h2>
          <p className="mt-1 text-xs text-slate-700">
            If you provide an email or phone number, it is encrypted with AES-256-GCM before being stored. The encryption key is kept in a separate secrets manager — not in the database. Even if someone gained access to the database, they would see encrypted blobs, not your contact info.
          </p>
          <p className="mt-1 text-xs text-slate-700">
            Your demographic responses (gender, age, province) are <strong>not encrypted</strong> because they contain no personally identifying information on their own and need to be queryable for aggregate reporting. A database breach revealing &ldquo;35 users are non-binary, aged 25–34, in Kigali&rdquo; does not identify any individual.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">Accounts are optional</h2>
          <p className="mt-1 text-xs text-slate-700">
            You never need an account to use this app. If you create one, you can delete it instantly — one tap, then confirmation, and all your data is permanently removed. There is no 30-day grace period.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">No data sharing</h2>
          <p className="mt-1 text-xs text-slate-700">
            Your data is never shared with third parties, governments, or law enforcement. There is no Google Analytics, Facebook SDK, or any tracker that sends data to external companies. All analytics are self-hosted.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">Emergency Data Destruction</h2>
          <p className="mt-1 text-xs text-slate-700">
            MRI maintains a one-click Emergency Data Destruction protocol. If there is ever an imminent legal threat, server seizure, or security breach that could expose user data, MRI can instantly purge all encrypted contact information from the database and destroy the encryption key. Demographic data and nicknames can optionally be retained — they are non-identifying.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">Contact</h2>
          <p className="mt-1 text-xs text-slate-700">
            For questions about your data, contact MRI through their official channels. MRI is the data controller for this application.
          </p>
        </section>
      </article>

      <div className="pt-2">
        <Link href="/" className="text-xs font-medium text-brand-700 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
