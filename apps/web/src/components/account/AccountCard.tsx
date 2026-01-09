import { Pencil, Trash2 } from "lucide-react";
import { AppCard } from "../../components/ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";
interface AccountCardProps {
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AccountCard({
    id,
    name,
    type,
    balance,
    color,
    onEdit,
    onDelete,
}: AccountCardProps) {
    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                }}
                title="Editar Conta"
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(id);
                }}
                title="Excluir Conta"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </>
    );

    return (
        <AppCard
            title={name}
            badge={
                <span className="text-xs font-mono uppercase tracking-wider">
                    {type}
                </span>
            }
            color={color}
            actions={actions}
        >
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    Saldo Atual
                </p>
                <p
                    className={`text-2xl font-bold ${
                        balance >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                >
                    <MoneyDisplay value={balance} />
                </p>
            </div>
        </AppCard>
    );
}
