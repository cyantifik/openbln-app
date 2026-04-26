"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <h1 className="text-3xl font-light tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-white/25 text-sm tracking-widest uppercase mb-12">
          Last updated: April 2026
        </p>

        <div className="space-y-8 text-white/50 text-sm leading-relaxed">
          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">1. Overview</h2>
            <p>
              OPEN BLN ("we", "us", "our") operates the websites open-bln.com and space.open-bln.com.
              This policy explains how we collect, use, and protect your personal data when you use our
              websites and community platform.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">2. Data We Collect</h2>
            <p className="mb-3">When you create an account or interact with our platform, we may collect:</p>
            <p>
              Your name, email address, and any information you provide in your profile or event
              registration (such as your role, skills, and bio). We also collect basic usage data
              through Google Analytics to understand how the site is used.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">3. How We Use Your Data</h2>
            <p>
              We use your data to operate the community platform, facilitate event registration,
              enable member connections, and improve the experience. We do not sell your data to
              third parties. We do not use your data for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">4. Data Storage</h2>
            <p>
              Your data is stored securely using Supabase (hosted on AWS in Frankfurt, Germany, EU).
              Authentication is handled through Supabase Auth with encrypted credentials. We retain
              your data for as long as your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">5. Your Rights (GDPR)</h2>
            <p>
              Under the General Data Protection Regulation (GDPR), you have the right to access,
              correct, or delete your personal data at any time. You may also request a copy of your
              data or withdraw consent for processing. To exercise these rights, contact us at
              hallo@open-bln.com.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We use Google
              Analytics for anonymized usage statistics. No third-party advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">7. Third-Party Services</h2>
            <p>
              We use the following third-party services: Supabase (database and authentication),
              Vercel (hosting), Google Analytics (usage statistics), and Cal.com (appointment booking).
              Each service has its own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">8. Contact</h2>
            <p>
              For questions about this privacy policy or your data, contact us at hallo@open-bln.com.
            </p>
          </section>
        </div>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
