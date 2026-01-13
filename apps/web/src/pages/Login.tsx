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
} from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";

const loginSchema = z.object({
    email: z.string().email("Por favor, insira um e-mail válido"),
    password: z.string().min(1, "A senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
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
            setAuthError("Credenciais inválidas. Tente novamente.");
            delete api.defaults.headers.common["Authorization"];
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
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
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Esqueceu a senha?
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
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </Button>
                        <div className="text-center text-sm mt-4">
                            Não tem uma conta?{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:underline"
                            >
                                Cadastre-se
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
