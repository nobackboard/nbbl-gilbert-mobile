import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand">NBBL Gilbert</div>
          <div className="footer-small">
            The first physical home of No Backboard Basketball.
          </div>
          <div className="footer-small footer-copy">The futsal of basketball.</div>
        </div>
        <div className="footer-meta">
          <div className="footer-small">Gilbert, Arizona</div>
          <div className="footer-small">NOW OPEN</div>
          <div className="footer-small footer-copy">
            <Link href="/#why">About NBBL</Link>
          </div>
          <div className="footer-small footer-copy">
            <Link href="/waivers">Waivers</Link>
          </div>
          <div className="footer-small footer-copy">
            <a
              href="/assets/NBBL%20Privacy%20Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
          <div className="footer-small footer-copy">
            <a
              href="/assets/NBBL%20Concussion%20Awareness%20and%20Return%20to%20Play%20Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Concussion Awareness and Return to Play Policy
            </a>
          </div>
          <div className="footer-small footer-copy">
            © 2026 No Backboard Basketball League
          </div>
          <div className="footer-small footer-copy">
            <a href="mailto:info@nobackboard.com">info@nobackboard.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
