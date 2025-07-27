'use client'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { SWRConfig } from 'swr';
import { Toaster } from "@/components/ui/sonner";

/* The code you provided defines a React functional component called `RootLayout`. This component takes
a single prop `children`, which is of type `React.ReactNode`. Within the component, it returns a
structure that represents the layout of the application. */
export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: Infinity,
            fetcher: async (url: string) => {
              await new Promise((resolve) => setTimeout(resolve, 3000));
              const response = await fetch(url);
              const data = await response.json();
              if (!response.ok || data?.status == "fail") {
                throw new Error(data?.message || "Failed to fetch data");
              }
              return data.data;
            }
          }}>
          {children}
          <Toaster position="top-right" />
        </SWRConfig>
      </body>
    </html>
  );
}
