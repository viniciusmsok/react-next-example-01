import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "React Next Example 01",
  description: "React Next Example 01",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
