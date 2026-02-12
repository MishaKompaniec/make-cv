import "../styles/globals.scss";

import localFont from "next/font/local";

import { Providers } from "./providers";

const inter = localFont({
  src: "../assets/fonts/Inter.ttf",
  display: "swap",
  variable: "--font-inter",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
