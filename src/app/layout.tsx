import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { TopNav } from "~/app/_components/TopNav";
import { ThemeProvider } from "~/components/ThemeProvider";
import { BottomNav } from "~/app/_components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Dagens Lågor",
  description: "App for the ceramics department of Sorangens folkhogskola",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-white">
        <body className={`font-sans ${inter.variable} h-lvh`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <TopNav />

              <SignedOut>Hello</SignedOut>
              <SignedIn>
                <div className="page-bottom-nav-offset page-top-nav-offset">
                  {children}
                </div>
              </SignedIn>
              <BottomNav />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
