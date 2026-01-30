import "../styles/globals.scss";
import { Sidebar } from "@/components/layout/sidebar/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
