import type { Metadata } from "next";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
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
  icons: {
    icon: [
      { url: "/fg-mark-v3.svg", type: "image/svg+xml" },
      { url: "/fg-mark-32-v3.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/fg-mark-v3.svg",
    apple: [{ url: "/fg-mark-touch-v3.png", type: "image/png", sizes: "180x180" }],
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
