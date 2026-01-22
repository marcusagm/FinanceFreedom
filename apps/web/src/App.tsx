import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Accounts } from "./pages/Accounts";
import { Budgets } from "./pages/Budgets";
import Dashboard from "./pages/Dashboard";
import Debts from "./pages/Debts";
import { ImapConfigPage } from "./pages/ImapConfigPage";
import { ImportPage } from "./pages/ImportPage";
import IncomePage from "./pages/Income";
import IncomeProjection from "./pages/IncomeProjection";
import InvestmentAccounts from "./pages/InvestmentAccounts";
import SavingsGoals from "./pages/SavingsGoals";
import { CreditCards } from "./pages/CreditCards";
import { Transactions } from "./pages/Transactions";
import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { Toaster } from "./components/ui/Sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivacyProvider } from "./contexts/PrivacyContext";
import { Categories } from "./pages/Categories";
import { FixedExpenses } from "./pages/FixedExpenses";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";
import { Settings } from "./pages/Settings";
import PersonsPage from "./pages/Persons";
import { LocalizationProvider } from "./contexts/LocalizationContext";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <LocalizationProvider>
                    <PrivacyProvider>
                        <BrowserRouter>
                            <Toaster />
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route
                                    path="/forgot-password"
                                    element={<ForgotPassword />}
                                />
                                <Route
                                    path="/reset-password"
                                    element={<ResetPassword />}
                                />
                                <Route element={<ProtectedRoute />}>
                                    <Route
                                        path="*"
                                        element={
                                            <Layout>
                                                <Routes>
                                                    <Route
                                                        path="/"
                                                        element={<Dashboard />}
                                                    />
                                                    <Route
                                                        path="/dashboard"
                                                        element={<Dashboard />}
                                                    />
                                                    <Route
                                                        path="/accounts"
                                                        element={<Accounts />}
                                                    />
                                                    <Route
                                                        path="/debts"
                                                        element={<Debts />}
                                                    />
                                                    <Route
                                                        path="/credit-cards"
                                                        element={
                                                            <CreditCards />
                                                        }
                                                    />
                                                    <Route
                                                        path="/income"
                                                        element={<IncomePage />}
                                                    />
                                                    <Route
                                                        path="/income/projection"
                                                        element={
                                                            <IncomeProjection />
                                                        }
                                                    />
                                                    <Route
                                                        path="/transactions"
                                                        element={
                                                            <Transactions />
                                                        }
                                                    />
                                                    <Route
                                                        path="/investments"
                                                        element={
                                                            <InvestmentAccounts />
                                                        }
                                                    />
                                                    <Route
                                                        path="/goals"
                                                        element={
                                                            <SavingsGoals />
                                                        }
                                                    />
                                                    <Route
                                                        path="/import"
                                                        element={<ImportPage />}
                                                    />
                                                    <Route
                                                        path="/import/config"
                                                        element={
                                                            <ImapConfigPage />
                                                        }
                                                    />
                                                    <Route
                                                        path="/categories"
                                                        element={<Categories />}
                                                    />
                                                    <Route
                                                        path="/budgets"
                                                        element={<Budgets />}
                                                    />
                                                    <Route
                                                        path="/fixed-expenses"
                                                        element={
                                                            <FixedExpenses />
                                                        }
                                                    />
                                                    <Route
                                                        path="/settings"
                                                        element={<Settings />}
                                                    />
                                                    <Route
                                                        path="/profile"
                                                        element={<Profile />}
                                                    />
                                                    <Route
                                                        path="/persons"
                                                        element={
                                                            <PersonsPage />
                                                        }
                                                    />
                                                </Routes>
                                            </Layout>
                                        }
                                    />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </PrivacyProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
