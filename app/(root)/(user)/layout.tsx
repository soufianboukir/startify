import { Footer, Header } from "@/layouts/header-footer";

export default function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        return (
        <html lang="en">
            <body className="h-[80vh] flex flex-col">
                <Header />
                    <main className="flex-1 min-h-[90vh] pt-20">
                        {children}
                    </main>
                <Footer />
            </body>
        </html>
    );
}
  
