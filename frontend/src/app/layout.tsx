import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PollStream | Real-Time Voting Platform",
  description: "Create, share, and track polls in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
