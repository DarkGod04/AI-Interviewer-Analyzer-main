import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from './provider';
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans", 
  display: 'swap',
});

export const metadata = {
  title: "VeritasAI",
  description: "VeritasAI - Your intelligent AI-powered recruitment assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased scroll-smooth font-sans text-slate-800 bg-slate-50`} suppressHydrationWarning>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
