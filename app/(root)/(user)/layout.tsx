import { Footer, Header } from "@/layouts/header-footer";

export default function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        return (
        <html lang="en" className="h-full">
            <body className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Footer />
            </body>
          </html>
    );
}
  
