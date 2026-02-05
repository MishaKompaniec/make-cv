import "../styles/globals.scss";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import localFont from "next/font/local";

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
      <body className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="create-flow-container">{children}</div>
        </main>
      </body>
    </html>
  );
}
