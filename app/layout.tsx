import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeitschLingo: Learn Pennsylvania Dutch",
  description:
    "Learn a little Pennsylvania Dutch every day with Dobbin the horse. Bite-size lessons, streaks, and a warm folk-art world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Rounded, friendly display + body fonts. Degrades to system rounded
            fonts if offline. Preconnect keeps first paint snappy. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
