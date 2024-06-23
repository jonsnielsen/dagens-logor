import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { TopNav } from "~/app/_components/TopNav";
import { ThemeProvider } from "~/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Dagens Lågor",
  description: "App for the ceramics department of Sorangens folkhogskola",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
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
              <SignedIn>{children}</SignedIn>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
