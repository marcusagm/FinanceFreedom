import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
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

const registerSchema = z
    .object({
        name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Por favor, insira um e-mail válido"),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
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

            notify.success("Conta criada com sucesso!");

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
                err.response?.data?.message ||
                "Falha no cadastro. Tente novamente.";
            setAuthError(Array.isArray(message) ? message.join(", ") : message);
            delete api.defaults.headers.common["Authorization"];
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Criar Conta</CardTitle>
                    <CardDescription>
                        Junte-se ao Finance Freedom para começar a gerenciar
                        suas finanças.
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
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="João Silva"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
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
                                Confirmar Senha
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
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
                            {isSubmitting ? "Criando conta..." : "Criar Conta"}
                        </Button>
                        <div className="text-center text-sm">
                            Já tem uma conta?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                Entrar
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
