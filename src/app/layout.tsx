import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { TopNav } from "~/app/_components/TopNav";
import { ThemeProvider } from "~/components/ThemeProvider";
import { BottomNav } from "~/app/_components/BottomNav";
import { Viewport } from "next";
import { Toaster } from "~/components/ui/sonner";

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

export const viewport: Viewport = {
  width: "device-width",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-white" suppressHydrationWarning>
        <body className={`font-sans ${inter.variable} h-lvh`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <TopNav />

              <div className="page-bottom-nav-offset page-top-nav-offset">
                <SignedOut>
                  <h1 className="absolute top-1/3 w-full px-4  text-center text-2xl">
                    {"Welcome to Dagens Lågor"}
                    <div>
                      {`Please press "Sign in" in order to use the app or create an account.`}
                    </div>
                  </h1>
                </SignedOut>
                <SignedIn>{children}</SignedIn>
              </div>
              <BottomNav />
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
