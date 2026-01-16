import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

const createForgotPasswordSchema = (t: any) =>
    z.object({
        email: z.string().email(t("auth.validation.emailRequired")),
    });

type ForgotPasswordForm = z.infer<
    ReturnType<typeof createForgotPasswordSchema>
>;

export function ForgotPassword() {
    const { t } = useTranslation();
    const forgotPasswordSchema = useMemo(
        () => createForgotPasswordSchema(t),
        [t]
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setSubmitError("");
        try {
            await api.post("/auth/forgot-password", { email: data.email });
            setIsSubmitted(true);
            notify.success(t("auth.forgotPassword.success"));
        } catch (err: any) {
            console.error("Forgot password failed", err);
            setSubmitError(t("auth.forgotPassword.error"));
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            {t("auth.forgotPassword.checkEmailTitle")}
                        </CardTitle>
                        <CardDescription>
                            {t("auth.forgotPassword.checkEmailDesc")}{" "}
                            <strong>{getValues("email")}</strong>
                            {t("auth.forgotPassword.checkEmailSuffix")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t("auth.forgotPassword.checkSpam")}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link to="/login">
                            <Button variant="outline">
                                {t("auth.forgotPassword.backToLogin")}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary/10 via-background to-muted p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t("auth.forgotPassword.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("auth.forgotPassword.subtitle")}
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
                            <Label htmlFor="email">
                                {t("auth.login.emailLabel")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t("auth.login.emailPlaceholder")}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
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
                                ? t("auth.forgotPassword.sending")
                                : t("auth.forgotPassword.sendButton")}
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
