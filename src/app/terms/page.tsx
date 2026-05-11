"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <h1 className="text-3xl font-light tracking-tight mb-2">Terms of Service</h1>
        <p className="text-white/25 text-sm tracking-widest uppercase mb-12">
          Last updated: May 2026
        </p>

        <div className="space-y-8 text-white/50 text-sm leading-relaxed">
          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">1. About OPEN BLN</h2>
            <p>
              OPEN BLN is an invite-only community platform for creative professionals in Berlin.
              By creating an account or using the platform at space.open-bln.com, you agree to these
              terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">2. Eligibility</h2>
            <p>
              Access to the platform requires an invitation. You must be at least 18 years old to
              use the platform. You are responsible for maintaining the confidentiality of your
              account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">3. Community Guidelines</h2>
            <p>
              Members are expected to engage respectfully and professionally. We do not tolerate
              harassment, spam, or misuse of the platform. OPEN BLN reserves the right to suspend
              or remove accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">4. Mentorship &amp; Booking</h2>
            <p>
              Mentors offer their time voluntarily. Booking a session does not guarantee availability.
              Mentors may approve or decline session requests at their discretion. All mentoring
              sessions are free of charge unless explicitly stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">5. Google Calendar Integration</h2>
            <p>
              Mentors may optionally connect their Google Calendar to automate session scheduling.
              When connected, we create calendar events on your behalf when you approve a booking
              request. We do not read, modify, or delete any existing calendar data. You can
              disconnect your calendar at any time from your profile settings.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">6. User Content</h2>
            <p>
              You retain ownership of any content you share on the platform, including your profile
              information, bio, and session notes. By using the platform, you grant OPEN BLN a
              non-exclusive license to display this content within the community space.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">7. Limitation of Liability</h2>
            <p>
              OPEN BLN is provided as-is. We make no warranties about the availability or reliability
              of the platform. We are not liable for any outcomes arising from mentorship sessions
              or community interactions facilitated through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">8. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after
              changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">9. Contact</h2>
            <p>
              For questions about these terms, contact us at hallo@open-bln.com.
            </p>
          </section>
        </div>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
