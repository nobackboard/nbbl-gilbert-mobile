import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import AnalyticsClickListener from "@/components/AnalyticsClickListener";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nobackboardbasketballgym.com"),
  title: {
    default: "NBBL Gilbert | The Futsal of Basketball",
    template: "%s | NBBL Gilbert",
  },
  description:
    "NBBL Gilbert is the first physical home of No Backboard Basketball in Gilbert, Arizona. Train. Measure. Compete. Build an audience. Fund the game.",
  keywords: [
    "NBBL Gilbert",
    "No Backboard Basketball",
    "Gilbert Arizona",
    "UHoop",
    "team development",
    "club showcases",
  ],
  openGraph: {
    title: "NBBL Gilbert | The Futsal of Basketball",
    description:
      "The first physical home of No Backboard Basketball. Train your team in Gilbert, Arizona. NOW OPEN.",
    url: "https://nobackboardbasketballgym.com",
    type: "website",
    locale: "en_US",
    siteName: "NBBL Gilbert",
    images: [
      {
        url: "/assets/hero.webp",
        width: 1800,
        height: 1800,
        alt: "No Backboard Basketball action at NBBL Gilbert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NBBL Gilbert | The Futsal of Basketball",
    description:
      "The first physical home of No Backboard Basketball in Gilbert, Arizona.",
    images: ["/assets/hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className={inter.className}>
        <AnalyticsClickListener />
        {children}
        {hubspotPortalId && !hubspotPortalId.startsWith("YOUR_") ? (
          <Script
            id="hs-script-loader"
            src={`//js.hs-scripts.com/${hubspotPortalId}.js`}
            strategy="afterInteractive"
          />
        ) : null}
        <Analytics />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
