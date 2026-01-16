import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { api } from "../lib/api";
import { notify } from "../lib/notification";

const createResetPasswordSchema = (t: any) =>
    z
        .object({
            newPassword: z
                .string()
                .min(6, t("auth.validation.passwordMinLength")),
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("auth.validation.passwordsMismatch"),
            path: ["confirmPassword"],
        });

type ResetPasswordForm = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export function ResetPassword() {
    const { t } = useTranslation();
    const resetPasswordSchema = useMemo(
        () => createResetPasswordSchema(t),
        [t]
    );
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            setSubmitError(t("auth.resetPassword.invalidToken"));
            return;
        }

        setSubmitError("");
        try {
            await api.post("/auth/reset-password", {
                token,
                newPassword: data.newPassword,
            });
            notify.success(t("auth.resetPassword.success"));
            navigate("/login");
        } catch (err: any) {
            console.error("Reset password failed", err);
            setSubmitError(
                err.response?.data?.message || t("auth.resetPassword.error")
            );
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary/10 via-background to-muted p-4">
                <Card className="w-full max-w-md shadow-lg border-primary/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">
                            {t("auth.resetPassword.invalidLinkTitle")}
                        </CardTitle>
                        <CardDescription>
                            {t("auth.resetPassword.invalidLinkDesc")}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link to="/forgot-password">
                            <Button variant="outline">
                                {t("auth.resetPassword.requestNewLink")}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t("auth.resetPassword.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("auth.resetPassword.subtitle")}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CardContent className="space-y-4">
                        {submitError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">
                                {t("auth.resetPassword.newPassword")}
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="******"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.newPassword.message}
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
                                placeholder="******"
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
                                ? t("auth.resetPassword.resetting")
                                : t("auth.resetPassword.button")}
                        </Button>
                        <div className="text-center text-sm">
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                {t("auth.forgotPassword.backToLogin")}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
