import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/thanks",
  },
};

export default function ThanksPage() {
  return (
    <>
      <Header />
      <main className="thanks-page">
        <div className="shell">
          <p className="chapter-kicker">NBBL Gilbert</p>
          <h1 className="display">Payment received.</h1>
          <p className="lead">
            Thank you. PayPal will send a receipt to your email, and our team
            will follow up about scheduling.
          </p>
          <p className="form-note">
            Questions? Email{" "}
            <a href="mailto:info@nobackboard.com">info@nobackboard.com</a>.
          </p>
          <Link className="btn primary" href="/#book">
            Back to NBBL Gilbert →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
