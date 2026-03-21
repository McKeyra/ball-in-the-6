import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/welcome" className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime">
          <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-neutral-900">Ball in the 6</span>
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: March 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-600">
        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">1. Information We Collect</h2>
          <p>
            We collect information you provide directly: name, email, date of birth, and profile
            details. We also collect usage data such as pages visited, features used, and device
            information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">2. How We Use Your Information</h2>
          <p>
            We use your information to provide and improve the Platform, personalize your experience,
            communicate updates, and ensure platform safety. We do not sell your personal data to
            third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">3. Youth Privacy</h2>
          <p>
            We take youth privacy seriously. Accounts for users under 13 are managed by parents.
            Teen accounts (13-17) have limited features. We comply with COPPA and Canadian privacy
            legislation (PIPEDA).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">4. Data Storage</h2>
          <p>
            Your data is stored on secure servers operated by DigitalOcean in Canadian data centres.
            We use encryption in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">5. Your Rights</h2>
          <p>
            You can access, update, or delete your personal data at any time through your account
            settings. You can request a full data export or account deletion by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">6. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We use analytics
            cookies to understand how the Platform is used. You can manage cookie preferences
            in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-neutral-900">7. Contact</h2>
          <p>
            Privacy questions? Contact our privacy team at privacy@enuw.ca.
          </p>
        </section>
      </div>
    </div>
  );
}
