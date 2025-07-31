
import { AppSidebar } from "@/components/app-sidebar";
import { ProfileMenu } from "@/components/dropdown-menu";
import { SearchInput } from "@/components/search-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        const session = await getServerSession(authOptions)

        return (
            <html lang="en">
                <body className="">
                    <main className="">
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator
                                    orientation="vertical"
                                    className="mr-2 data-[orientation=vertical]:h-4"
                                    />
                                </div>
                                <div className="flex items-center gap-2 justify-end mr-3">
                                    <SearchInput />
                                    <ThemeToggle />
                                    {
                                        session && <ProfileMenu session={session}/>
                                    }
                                </div>
                            </header>
                            <div className="px-5 pt-2">
                                {children}
                            </div>
                        </SidebarInset>
                        </SidebarProvider>
                    </main>
                </body>
            </html>
    );
}
  
