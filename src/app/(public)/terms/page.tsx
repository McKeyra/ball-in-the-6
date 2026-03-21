import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/welcome" className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime">
          <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-neutral-900">Ball in the 6</span>
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: March 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Ball in the 6 (&quot;the Platform&quot;), operated by ENUW Inc,
            you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">2. Eligibility</h2>
          <p>
            You must be at least 13 years of age to create an account. Users under 18 require
            parental or guardian consent. Users under 13 may only access the Platform through
            a parent-managed account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities under your account. You agree to provide accurate information
            during registration.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">4. Acceptable Use</h2>
          <p>
            You agree not to misuse the Platform, including but not limited to: harassing other users,
            posting inappropriate content, attempting to gain unauthorized access, or using the Platform
            for illegal purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">5. Intellectual Property</h2>
          <p>
            All content, branding, and technology on the Platform are the property of ENUW Inc.
            User-generated content remains yours, but you grant ENUW Inc a license to display
            it on the Platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">6. Limitation of Liability</h2>
          <p>
            The Platform is provided &quot;as is&quot; without warranties. ENUW Inc is not liable
            for damages arising from your use of the Platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">7. Contact</h2>
          <p>
            Questions about these Terms? Contact us at legal@enuw.ca.
          </p>
        </section>
      </div>
    </div>
  );
}
