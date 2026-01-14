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
import { PrivacyProvider } from "./contexts/PrivacyContext";
import { Toaster } from "./components/ui/Sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Settings } from "./pages/Settings";
import { Categories } from "./pages/Categories";
import { FixedExpenses } from "./pages/FixedExpenses";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    console.log("App component rendering");
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <PrivacyProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Toaster />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
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
                                                    path="/accounts"
                                                    element={<Accounts />}
                                                />
                                                <Route
                                                    path="/debts"
                                                    element={<Debts />}
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
                                                    element={<Transactions />}
                                                />
                                                <Route
                                                    path="/import"
                                                    element={<ImportPage />}
                                                />
                                                <Route
                                                    path="/import/config"
                                                    element={<ImapConfigPage />}
                                                />
                                                <Route
                                                    path="/categories"
                                                    element={<Categories />}
                                                />
                                                <Route
                                                    path="/fixed-expenses"
                                                    element={<FixedExpenses />}
                                                />
                                                <Route
                                                    path="/settings"
                                                    element={<Settings />}
                                                />
                                                <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                />
                                            </Routes>
                                        </Layout>
                                    }
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </PrivacyProvider>
        </ThemeProvider>
    );
}

export default App;
