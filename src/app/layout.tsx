import type { Metadata } from "next";
import "./globals.css";
import { Patrick_Hand } from "next/font/google";

const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Draw 123",
  description: "Learn to draw/write digits with canvas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${patrickHand.className} antialiased max-h-screen`}>
        <div
          className="absolute inset-0 -z-50"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
            backgroundSize: "40px 40px",
          }}
        />
        <div>{children}</div>
      </body>
    </html>
  );
}
