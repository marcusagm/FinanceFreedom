import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";

const createLoginSchema = (t: any) =>
    z.object({
        email: z.string().email(t("auth.validation.emailRequired")),
        password: z.string().min(1, t("auth.validation.passwordRequired")),
    });

type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;

export function Login() {
    const { t } = useTranslation();
    const loginSchema = useMemo(() => createLoginSchema(t), [t]);
    const [authError, setAuthError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setAuthError("");

        try {
            const response = await api.post("/auth/login", data);
            const { access_token } = response.data;

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${access_token}`;
            const profileRes = await api.get("/auth/profile");

            login(access_token, profileRes.data);
            navigate("/");
        } catch (err: any) {
            console.error("Login failed", err);
            setAuthError(t("auth.login.invalidCredentials"));
            delete api.defaults.headers.common["Authorization"];
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary/10 via-background to-muted p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Finance Freedom
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CardContent className="space-y-4">
                        {authError && (
                            <Alert variant="destructive">
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                {t("auth.login.emailLabel")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t("auth.login.emailPlaceholder")}
                                data-testid="email-input"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {t("auth.login.passwordLabel")}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                data-testid="password-input"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    {t("auth.login.forgotPassword")}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t("auth.login.signingIn")
                                : t("auth.login.signIn")}
                        </Button>
                        <div className="text-center text-sm mt-4">
                            {t("auth.login.noAccount")}{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:underline"
                            >
                                {t("auth.login.registerLink")}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
