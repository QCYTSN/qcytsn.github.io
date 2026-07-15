import type { Metadata } from "next";
import "./globals.css";
import { SITE_ORIGIN } from "./site-origin";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "Fengkai Gao — Computer Vision Research",
  description:
    "Research portfolio of Fengkai Gao, an Artificial Intelligence undergraduate working on computer vision, vision-language models, and generative models.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_ORIGIN,
    title: "Fengkai Gao — Computer Vision Research",
    description:
      "Research portfolio exploring computer vision, vision-language model evaluation, and controllable generative models.",
    siteName: "Fengkai Gao Research Portfolio",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    card: "summary",
    title: "Fengkai Gao — Computer Vision Research",
    description:
      "Computer vision, vision-language model evaluation, and controllable generative model projects.",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
