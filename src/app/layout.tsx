import "../styles/globals.scss";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
