import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupplierKit - AI-Powered Hotel Group Sales Proposals",
  description:
    "Create stunning, interactive hotel group proposals in minutes. AI-powered proposal generation for MICE and group sales teams.",
  openGraph: {
    title: "SupplierKit - AI-Powered Hotel Group Sales Proposals",
    description:
      "Create stunning, interactive hotel group proposals in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
