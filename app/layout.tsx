import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adn-community.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ADN Academy — École de formation data (Excel, SQL, R)",
    template: "%s | ADN Academy",
  },
  description:
    "ADN Academy forme les talents data d'Afrique francophone : Excel, SQL, R, en direct et en petit groupe. Rejoins ADN Community sur WhatsApp.",
  keywords: [
    "formation Excel",
    "formation SQL",
    "formation R",
    "data analyst Afrique",
    "école data Côte d'Ivoire",
    "ADN Academy",
    "ADN Community",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADN Academy",
    title: "ADN Academy — École de formation data (Excel, SQL, R)",
    description:
      "Formations Excel, SQL et R pour l'Afrique francophone, en direct et en petit groupe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADN Academy — École de formation data",
    description: "Formations Excel, SQL et R pour l'Afrique francophone.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`h-full ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "ADN Academy",
              url: siteUrl,
              description:
                "École de formation data (Excel, SQL, R) pour l'Afrique francophone.",
              sameAs: ["https://wa.me/2250564094530"],
            }),
          }}
        />
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
