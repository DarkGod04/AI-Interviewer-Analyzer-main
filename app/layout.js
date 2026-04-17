import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from './provider';
import { Toaster } from "@/components/ui/sonner"
import GlobalCrosshair from "@/components/GlobalCrosshair";

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
      <body className={`${outfit.variable} antialiased scroll-smooth font-sans text-white bg-slate-950`} suppressHydrationWarning style={{ cursor: 'none' }}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
        {/* Global pink crosshair cursor — covers every page */}
        <GlobalCrosshair />
      </body>
    </html>
  );
}
