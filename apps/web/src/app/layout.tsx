import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contractors OS",
  description: "The operating system for home services businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
