import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import './globals.css';
import SupabaseProvider from "../../contexts/SupabaseProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mind Heavenly - AI-Powered Therapy Platform",
  description: "Secure, HIPAA-compliant therapy platform with AI support for individuals and couples",
  keywords: ["therapy", "mental health", "AI", "counseling", "couples therapy", "HIPAA"],
  authors: [{ name: "Mind Heavenly Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Mind Heavenly - AI-Powered Therapy Platform",
    description: "Secure, HIPAA-compliant therapy platform with AI support for individuals and couples",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
