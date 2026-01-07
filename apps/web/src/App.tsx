import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Accounts } from "./pages/Accounts";

import { Transactions } from "./pages/Transactions";
import { ImportPage } from "./pages/ImportPage";
import "./App.css";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="font-bold text-xl">
                            FinanceFreedom
                        </Link>
                        <nav className="flex gap-4">
                            <Link
                                to="/accounts"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Contas
                            </Link>
                            <Link
                                to="/transactions"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Transações
                            </Link>
                            <Link
                                to="/import"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Importar
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}

function App() {
    console.log("App component rendering");
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/accounts" replace />}
                    />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/import" element={<ImportPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
