import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupplierKit - AI-Powered Proposal Lifecycle Management for Hotels",
  description:
    "From RFP to delivery, automated. SupplierKit gives hotel sales teams AI agents that extract RFPs, optimize pricing, generate proposals, enforce brand standards, and track obligations.",
  keywords: [
    "hotel proposal software",
    "MICE proposal automation",
    "hotel group sales",
    "RFP management hotels",
    "AI hotel proposals",
    "hotel sales automation",
    "group booking software",
    "hotel revenue management",
    "proposal lifecycle management",
  ],
  openGraph: {
    title: "SupplierKit - AI-Powered Proposal Lifecycle Management for Hotels",
    description:
      "Purpose-built AI agents for hotel group sales. Extract RFPs, optimize pricing, generate proposals, and track delivery — all in one platform.",
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
