import { toast } from "sonner";

export const notify = {
    success: (title: string, message?: string) => {
        toast.success(title, {
            description: message,
            duration: 5000,
        });
    },
    error: (title: string, message?: string) => {
        toast.error(title, {
            description: message,
            duration: 5000,
            action: {
                label: "Fechar",
                onClick: () => {},
            },
        });
    },
    info: (title: string, message?: string) => {
        toast.info(title, {
            description: message,
        });
    },
    loading: (title: string) => {
        return toast.loading(title);
    },
    dismiss: (id: string | number) => {
        toast.dismiss(id);
    },
};
