/**
 * Self-hosted fonts via Fontsource (no build-time fetch to Google Fonts).
 * Avoids intermittent next/font/google failures when Google returns
 * extensionless font URLs (Next.js loader.js:122 / vercel/next.js#99114).
 */
import "@fontsource-variable/inter/standard.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow-condensed/900.css";
