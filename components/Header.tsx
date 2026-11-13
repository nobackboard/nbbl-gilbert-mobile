"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "https://academy.nobackboard.com/", label: "Academy", external: true },
  { href: "/#book", label: "Train Your Team" },
  { href: "/#showcases", label: "Showcases" },
  { href: "/#difference", label: "The NBBL Difference" },
  { href: "/#fundraiser", label: "Fundraising" },
  { href: "/#gym", label: "The Gym" },
  { href: "/#creators", label: "Creators" },
  { href: "/#why", label: "About" },
  { href: "/waivers", label: "Waivers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  function closeNav() {
    setOpen(false);
  }

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header>
      <div className="shell nav">
        <div className="brand">
          <Link href="/" aria-label="NBBL Gilbert home">
            <Image
              src="/assets/logo.png"
              alt=""
              width={80}
              height={80}
              className="brand-logo"
              priority
            />
          </Link>
          <a
            href="https://nobackboard.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NBBL"
          >
            <Image
              src="/assets/nbbl-logo.webp"
              alt="NBBL"
              width={80}
              height={80}
              className="brand-nbbl-logo"
              priority
            />
          </a>
        </div>
        <nav
          id="site-menu"
          className={`navlinks${open ? " open" : ""}`}
          aria-label="Main navigation"
        >
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNav}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} onClick={closeNav}>
                {link.label}
              </Link>
            ),
          )}
          <p className="nav-meta">Gilbert, Arizona · NOW OPEN!</p>
        </nav>
        <Link className="btn primary navcta" href="/#book">
          Book Your Team →
        </Link>
        <button
          className={`menu${open ? " is-open" : ""}`}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>
      <a
        className="academy-bar"
        href="https://academy.nobackboard.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ab-new">New</span>
        <span className="ab-long">
          Shooting &amp; Scoring Academy · Grades 6–9 · Open House Nov 19–21 ·
          $30 intro class
        </span>
        <span className="ab-short">Academy Open House · Nov 19–21</span>
        <span className="ab-go">Register →</span>
      </a>
    </header>
  );
}
