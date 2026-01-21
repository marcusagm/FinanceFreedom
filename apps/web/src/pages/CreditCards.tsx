import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/Dialog";
import { CreditCardCard } from "../components/credit-card/CreditCardCard";
import { CreditCardDialog } from "../components/credit-card/CreditCardDialog";
import { DeleteCreditCardDialog } from "../components/credit-card/DeleteCreditCardDialog";
import { InvoiceDialog } from "../components/credit-card/InvoiceDialog";
import { creditCardService } from "../services/credit-card.service";
import type {
    CreateCreditCardDTO,
    CreditCard,
    UpdateCreditCardDTO,
} from "../types/credit-card";
import { toast } from "sonner";
import { AppAlert } from "../components/ui/AppAlert";

export const CreditCards: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // State for UI actions
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);
    const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);
    const [cardToView, setCardToView] = useState<CreditCard | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Queries
    const { data: cards, isLoading } = useQuery({
        queryKey: ["credit-cards"],
        queryFn: creditCardService.getAll,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: creditCardService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
            setIsFormOpen(false);
            toast.success(t("creditCard.createSuccess"));
        },
        onError: () => {
            toast.error(t("creditCard.createError"));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCreditCardDTO }) =>
            creditCardService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
            setIsFormOpen(false);
            setCardToEdit(null);
            toast.success(t("common.savedSuccess"));
        },
        onError: () => {
            toast.error(t("common.error"));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: creditCardService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
            setCardToDelete(null);
            toast.success(t("creditCard.deleteSuccess"));
        },
        onError: () => {
            toast.error(t("creditCard.deleteError"));
        },
    });

    const handleCreate = (data: CreateCreditCardDTO) => {
        createMutation.mutate(data);
    };

    const handleUpdate = (data: UpdateCreditCardDTO) => {
        if (cardToEdit) {
            updateMutation.mutate({ id: cardToEdit.id, data });
        }
    };

    const handleEditClick = (card: CreditCard) => {
        setCardToEdit(card);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (card: CreditCard) => {
        setCardToDelete(card);
    };

    const handleViewClick = (card: CreditCard) => {
        setCardToView(card);
    };

    const handleConfirmDelete = () => {
        if (cardToDelete) {
            setIsDeleting(true);
            deleteMutation.mutate(cardToDelete.id, {
                onSettled: () => setIsDeleting(false),
            });
        }
    };

    const openCreateDialog = () => {
        setCardToEdit(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            {error && (
                <AppAlert
                    variant="destructive"
                    title={t("common.error")}
                    description={error}
                    className="mb-4"
                />
            )}

            <PageHeader
                title={t("creditCard.title")}
                description={t("creditCard.description")}
                actions={
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("creditCard.add")}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <div>{t("common.loading")}</div>
                ) : (
                    cards?.map((card) => (
                        <CreditCardCard
                            key={card.id}
                            card={card}
                            availableLimit={
                                card.limit + (card.account?.balance || 0)
                            } // Available = Limit - Used (where Used is negative balance, so Limit + Balance)
                            currentInvoiceTotal={Math.abs(
                                card.account?.balance || 0,
                            )}
                            onClick={() => handleViewClick(card)}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>

            <CreditCardDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={cardToEdit ? handleUpdate : handleCreate}
                initialData={cardToEdit || undefined}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteCreditCardDialog
                isOpen={!!cardToDelete}
                onClose={() => setCardToDelete(null)}
                onConfirm={handleConfirmDelete}
                cardName={cardToDelete?.name || ""}
                isDeleting={isDeleting}
            />

            <InvoiceDialog
                isOpen={!!cardToView}
                onClose={() => setCardToView(null)}
                card={cardToView}
            />
        </div>
    );
};
