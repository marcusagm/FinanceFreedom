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
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { notify } from "../lib/notification";

const createRegisterSchema = (t: any) =>
    z
        .object({
            name: z.string().min(2, t("auth.validation.nameMinLength")),
            email: z.string().email(t("auth.validation.emailRequired")),
            password: z.string().min(6, t("auth.validation.passwordMinLength")),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("auth.validation.passwordsMismatch"),
            path: ["confirmPassword"],
        });

type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;

export function Register() {
    const { t } = useTranslation();
    const registerSchema = useMemo(() => createRegisterSchema(t), [t]);
    const [authError, setAuthError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setAuthError("");

        try {
            await api.post("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            notify.success(t("auth.register.success"));

            // Auto-login
            const loginRes = await api.post("/auth/login", {
                email: data.email,
                password: data.password,
            });
            const { access_token } = loginRes.data;

            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${access_token}`;
            const profileRes = await api.get("/auth/profile");

            login(access_token, profileRes.data);
            navigate("/");
        } catch (err: any) {
            console.error("Registration failed", err);
            const message =
                err.response?.data?.message || t("auth.register.error");
            setAuthError(Array.isArray(message) ? message.join(", ") : message);
            delete api.defaults.headers.common["Authorization"];
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary/10 via-background to-muted p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t("auth.register.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("auth.register.subtitle")}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CardContent className="space-y-4">
                        {authError && (
                            <Alert variant="destructive">
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {t("auth.register.nameLabel")}
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                data-testid="name-input"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                {t("auth.login.emailLabel")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                {t("auth.register.confirmPasswordLabel")}
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                data-testid="confirm-password-input"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t("auth.register.creating")
                                : t("auth.register.button")}
                        </Button>
                        <div className="text-center text-sm">
                            {t("auth.register.alreadyHaveAccount")}{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                {t("auth.login.signIn")}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
