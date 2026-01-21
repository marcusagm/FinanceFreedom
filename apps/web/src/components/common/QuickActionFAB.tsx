import { CreditCard as CreditCardIcon, Plus, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api";
import type { Account } from "../../types";
import { DebtForm } from "../debt/DebtForm";
import {
    categoryService,
    type Category,
} from "../../services/category.service";
import { creditCardService } from "../../services/credit-card.service";
import type { CreditCard } from "../../types/credit-card";
import { NewTransactionDialog } from "../transactions/NewTransactionDialog";
import { Button } from "../ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/DropdownMenu";

export function QuickActionFAB() {
    const { t } = useTranslation();
    const [isTransactionOpen, setIsTransactionOpen] = useState(false);
    const [isDebtOpen, setIsDebtOpen] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

    useEffect(() => {
        if (isTransactionOpen) {
            api.get("/accounts")
                .then((res) => setAccounts(res.data))
                .catch(console.error);

            categoryService.getAll().then(setCategories).catch(console.error);
            creditCardService
                .getAll()
                .then(setCreditCards)
                .catch(console.error);
        }
    }, [isTransactionOpen]);

    return (
        <>
            <div className="fixed bottom-24 md:bottom-8 right-8 z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
                        >
                            <Plus className="h-6 w-6 text-primary-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="mb-2 w-48">
                        <DropdownMenuItem
                            onClick={() => setIsTransactionOpen(true)}
                        >
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>
                                {t("dashboard.quickActions.newTransaction")}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDebtOpen(true)}>
                            <CreditCardIcon className="mr-2 h-4 w-4" />
                            <span>{t("dashboard.quickActions.newDebt")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <NewTransactionDialog
                isOpen={isTransactionOpen}
                onClose={() => setIsTransactionOpen(false)}
                onSuccess={() => {
                    window.location.reload();
                }}
                accounts={accounts}
                categories={categories}
                creditCards={creditCards}
            />

            <DebtForm
                isOpen={isDebtOpen}
                onClose={() => setIsDebtOpen(false)}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </>
    );
}
