import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex md:flex-row flex-col">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex" />

            {/* Mobile Header (just for logo/menu trigger if needed, currently keeping simple) */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
                <span className="font-bold text-lg text-primary">
                    FinanceFreedom
                </span>
                {/* <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button> */}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 pb-20 md:pb-0 md:p-6 p-4 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                <div className="max-w-7xl mx-auto space-y-6">{children}</div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
