import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
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
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { notify } from "../lib/notification";

const createProfileSchema = (t: any) =>
    z.object({
        name: z.string().min(2, t("auth.validation.nameRequired")),
        email: z.string().email(t("auth.validation.emailInvalid")),
    });

const createPasswordSchema = (t: any) =>
    z
        .object({
            currentPassword: z
                .string()
                .min(1, t("auth.validation.currentPasswordRequired")),
            newPassword: z
                .string()
                .min(6, t("auth.validation.passwordMinLength")),
            confirmNewPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: t("auth.validation.passwordsMismatch"),
            path: ["confirmNewPassword"],
        });

type ProfileForm = z.infer<ReturnType<typeof createProfileSchema>>;
type PasswordForm = z.infer<ReturnType<typeof createPasswordSchema>>;

export function Profile() {
    const { t } = useTranslation();
    const { user, login } = useAuth();

    const profileSchema = createProfileSchema(t);
    const passwordSchema = createPasswordSchema(t);

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

            notify.success(t("profile.updateSuccess"));
        } catch (error: any) {
            console.error("Profile update failed", error);
            notify.error(
                t("profile.updateError"),
                error.response?.data?.message || t("common.unknownError")
            );
        }
    };

    const onChangePassword = async (data: PasswordForm) => {
        try {
            await api.put("/auth/password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            notify.success(t("profile.passwordSuccess"));
            resetPasswordForm();
        } catch (error: any) {
            console.error("Password change failed", error);
            notify.error(
                t("profile.passwordError"),
                error.response?.data?.message || t("common.unknownError")
            );
        }
    };

    return (
        <div className="space-y-6 container mx-auto p-4 max-w-4xl">
            <PageHeader
                title={t("profile.title")}
                description={t("profile.subtitle")}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("profile.personalInfoTitle")}</CardTitle>
                        <CardDescription>
                            {t("profile.personalInfoDesc")}
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={handleSubmitProfile(onUpdateProfile)}
                        noValidate
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {t("auth.register.nameLabel")}
                                </Label>
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
                                <Label htmlFor="email">
                                    {t("auth.login.emailLabel")}
                                </Label>
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
                                    ? t("common.saving")
                                    : t("common.saveChanges")}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("profile.changePasswordTitle")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.changePasswordDesc")}
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={handleSubmitPassword(onChangePassword)}
                        noValidate
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">
                                    {t("profile.currentPassword")}
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
                                <Label htmlFor="newPassword">
                                    {t("auth.resetPassword.newPassword")}
                                </Label>
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
                                    {t("profile.confirmNewPassword")}
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
                                    ? t("common.updating")
                                    : t("profile.updatePasswordButton")}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
