import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speak — Language Learning",
  description: "Practice speaking with real-time transcription. Browse courses, pick a lesson, and start talking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="mx-auto max-w-lg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
