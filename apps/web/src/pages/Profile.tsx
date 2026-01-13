import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { PageHeader } from "../components/ui/PageHeader";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { notify } from "../lib/notification";

const profileSchema = z.object({
    name: z.string().min(2, "O nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "A senha atual é obrigatória"),
        newPassword: z
            .string()
            .min(6, "A nova senha deve ter pelo menos 6 caracteres"),
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "As senhas não coincidem",
        path: ["confirmNewPassword"],
    });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function Profile() {
    const { user, login } = useAuth();

    // Form for Profile
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    // Form for Password
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPasswordForm,
        formState: {
            errors: passwordErrors,
            isSubmitting: isPasswordSubmitting,
        },
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (user) {
            setProfileValue("name", user.name || "");
            setProfileValue("email", user.email);
        }
    }, [user, setProfileValue]);

    const onUpdateProfile = async (data: ProfileForm) => {
        try {
            const response = await api.put("/auth/profile", data);
            const updatedUser = response.data;

            const token = localStorage.getItem("token");
            if (token) {
                login(token, updatedUser);
            }

            notify.success("Dados atualizados com sucesso!");
        } catch (error: any) {
            console.error("Profile update failed", error);
            notify.error(
                "Erro ao atualizar perfil",
                error.response?.data?.message || "Erro desconhecido"
            );
        }
    };

    const onChangePassword = async (data: PasswordForm) => {
        try {
            await api.put("/auth/password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            notify.success("Senha alterada com sucesso!");
            resetPasswordForm();
        } catch (error: any) {
            console.error("Password change failed", error);
            notify.error(
                "Erro ao alterar senha",
                error.response?.data?.message || "Erro desconhecido"
            );
        }
    };

    return (
        <div className="space-y-6 container mx-auto p-4 max-w-4xl">
            <PageHeader
                title="Meu Perfil"
                description="Gerencie suas informações e segurança."
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados Pessoais</CardTitle>
                        <CardDescription>
                            Atualize seu nome e e-mail.
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={handleSubmitProfile(onUpdateProfile)}
                        noValidate
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    data-testid="profile-name-input"
                                    {...registerProfile("name")}
                                />
                                {profileErrors.name && (
                                    <p className="text-sm text-destructive">
                                        {profileErrors.name.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    data-testid="profile-email-input"
                                    {...registerProfile("email")}
                                />
                                {profileErrors.email && (
                                    <p className="text-sm text-destructive">
                                        {profileErrors.email.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={isProfileSubmitting}
                            >
                                {isProfileSubmitting
                                    ? "Salvando..."
                                    : "Salvar Alterações"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alterar Senha</CardTitle>
                        <CardDescription>
                            Mantenha sua conta segura.
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={handleSubmitPassword(onChangePassword)}
                        noValidate
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">
                                    Senha Atual
                                </Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    data-testid="current-password-input"
                                    {...registerPassword("currentPassword")}
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="text-sm text-destructive">
                                        {passwordErrors.currentPassword.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Senha</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    data-testid="new-password-input"
                                    {...registerPassword("newPassword")}
                                />
                                {passwordErrors.newPassword && (
                                    <p className="text-sm text-destructive">
                                        {passwordErrors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword">
                                    Confirmar Nova Senha
                                </Label>
                                <Input
                                    id="confirmNewPassword"
                                    type="password"
                                    data-testid="confirm-new-password-input"
                                    {...registerPassword("confirmNewPassword")}
                                />
                                {passwordErrors.confirmNewPassword && (
                                    <p className="text-sm text-destructive">
                                        {
                                            passwordErrors.confirmNewPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={isPasswordSubmitting}
                            >
                                {isPasswordSubmitting
                                    ? "Alterando..."
                                    : "Alterar Senha"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
