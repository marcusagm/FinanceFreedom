import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { notify } from "../lib/notification";

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
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
            setSubmitError("Token inválido ou ausente.");
            return;
        }

        setSubmitError("");
        try {
            await api.post("/auth/reset-password", {
                token,
                newPassword: data.newPassword,
            });
            notify.success("Senha redefinida com sucesso!");
            navigate("/login");
        } catch (err: any) {
            console.error("Reset password failed", err);
            setSubmitError(
                err.response?.data?.message ||
                    "Ocorreu um erro ao redefinir a senha."
            );
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">
                            Link Inválido
                        </CardTitle>
                        <CardDescription>
                            O token de redefinição de senha está ausente.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link to="/forgot-password">
                            <Button variant="outline">
                                Solicitar novo link
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
                    <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
                    <CardDescription>
                        Crie uma nova senha para sua conta.
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
                            <Label htmlFor="newPassword">Nova Senha</Label>
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
                                Confirmar Senha
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
                                ? "Redefinindo..."
                                : "Redefinir Senha"}
                        </Button>
                        <div className="text-center text-sm">
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                Voltar para o Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
