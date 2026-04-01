import type { Metadata } from "next";
import { Nav } from "./_components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "WakeLog",
  description: "起床時刻記録アプリ",
};

const themeScript = `
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1 px-6 pt-16 pb-8 max-w-md mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
