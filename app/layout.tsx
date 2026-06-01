import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'askZuZu — Ask your robot friend anything!',
  description:
    'ZuZu is a friendly robot who loves answering curious questions from kids aged 6–15. Safe, age-appropriate, and always kind.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Nunito font is loaded via @import in globals.css.
          This preconnect hint speeds up that request.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-sans bg-zuzu-bg text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
