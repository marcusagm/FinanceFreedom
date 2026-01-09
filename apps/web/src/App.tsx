import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Accounts } from "./pages/Accounts";
import Debts from "./pages/Debts";

import { Transactions } from "./pages/Transactions";
import { ImportPage } from "./pages/ImportPage";
import { ImapConfigPage } from "./pages/ImapConfigPage";
import Dashboard from "./pages/Dashboard";
import IncomePage from "./pages/Income";
import IncomeProjection from "./pages/IncomeProjection";
import "./App.css";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { Layout } from "./components/layout/Layout";

function App() {
    console.log("App component rendering");
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/debts" element={<Debts />} />
                        <Route path="/income" element={<IncomePage />} />
                        <Route
                            path="/income/projection"
                            element={<IncomeProjection />}
                        />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                        <Route path="/import" element={<ImportPage />} />
                        <Route
                            path="/import/config"
                            element={<ImapConfigPage />}
                        />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
