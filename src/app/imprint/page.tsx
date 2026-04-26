"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Imprint() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Nav variant="dark" />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <h1 className="text-3xl font-light tracking-tight mb-2">Imprint</h1>
        <p className="text-white/25 text-sm tracking-widest uppercase mb-12">
          Impressum
        </p>

        <div className="space-y-8 text-white/50 text-sm leading-relaxed">
          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Information according to &sect; 5 TMG</h2>
            <p>
              OPEN BLN<br />
              Vicky Heinlein<br />
              Berlin, Germany
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Contact</h2>
            <p>
              Email: hallo@open-bln.com<br />
              Website: open-bln.com
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Responsible for content according to &sect; 55 Abs. 2 RStV</h2>
            <p>
              Vicky Heinlein<br />
              Berlin, Germany
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Liability for content</h2>
            <p>
              The contents of our pages were created with the greatest care. However, we cannot
              guarantee the accuracy, completeness, or timeliness of the content. As a service
              provider, we are responsible for our own content on these pages under general law.
              However, we are not obligated to monitor transmitted or stored third-party information
              or to investigate circumstances that indicate illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Liability for links</h2>
            <p>
              Our website contains links to external websites of third parties over whose content
              we have no influence. We cannot accept any liability for this external content. The
              respective provider or operator of the pages is always responsible for the content
              of the linked pages.
            </p>
          </section>

          <section>
            <h2 className="text-white/80 text-base font-semibold mb-3">Copyright</h2>
            <p>
              The content and works on these pages created by the site operators are subject to
              copyright law. Duplication, editing, distribution, and any kind of use beyond the
              limits of copyright law require the written consent of the respective author or
              creator. Downloads and copies of this site are only permitted for private,
              non-commercial use.
            </p>
          </section>
        </div>
      </main>

      <Footer variant="dark" />
    </div>
  );
}
