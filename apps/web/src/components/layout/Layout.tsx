import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full bg-background text-foreground flex md:flex-row flex-col overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex shrink-0" />

            {/* Content Column */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header (just for logo/menu trigger if needed, currently keeping simple) */}
                <div className="md:hidden shrink-0 flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
                    <span className="font-bold text-lg text-primary">
                        FinanceFreedom
                    </span>
                    {/* <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button> */}
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
