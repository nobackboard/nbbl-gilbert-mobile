import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmartWaiverWidget from "@/components/SmartWaiverWidget";
import { WAIVER_FORMS } from "@/lib/waivers";

export const metadata: Metadata = {
  title: "Waivers",
  description:
    "Sign NBBL Gilbert waivers for minor athletes and for coaches or parents who enter active athletic areas.",
  alternates: {
    canonical: "/waivers",
  },
};

export default function WaiversPage() {
  return (
    <>
      <Header />
      <main className="waivers-page">
        <div className="shell">
          <p className="chapter-kicker">NBBL Gilbert</p>
          <h1 className="display">Waivers.</h1>
          <p className="lead">
            Parents and guardians sign the minor-athlete forms before a player
            trains, competes, or appears on NBBL Gilbert content. Coaches,
            trainers, and parents who enter the court sign the participating
            adult waiver.
          </p>
          <p className="lead">
            Use the Sign waivers bar at the bottom of this page, or open a form
            below.
          </p>
          <ul className="waiver-list">
            {WAIVER_FORMS.map((waiver) => (
              <li className="waiver-card" key={waiver.id}>
                <h2>{waiver.title}</h2>
                <a
                  className="btn primary"
                  href={waiver.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign →
                </a>
              </li>
            ))}
          </ul>
          <p className="form-note">
            Questions? Email{" "}
            <a href="mailto:info@nobackboard.com">info@nobackboard.com</a>.
          </p>
        </div>
      </main>
      <Footer />
      <SmartWaiverWidget />
    </>
  );
}
