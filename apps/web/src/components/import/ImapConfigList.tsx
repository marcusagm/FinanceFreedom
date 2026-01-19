import { Edit, Trash2 } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { AppAlert } from "../ui/AppAlert";
import { Button } from "../ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";

export interface ImapConfig {
    id: string;
    email: string;
    host: string;
    folder: string;
    sender?: string;
    subject?: string;
    lastSync?: string; // Optional if we track this
}

interface ImapConfigListProps {
    configs: ImapConfig[];
    onEdit: (config: ImapConfig) => void;
    onDelete: (id: string) => void;
}

export const ImapConfigList: React.FC<ImapConfigListProps> = ({
    configs,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();

    if (configs.length === 0) {
        return (
            <AppAlert
                variant="default"
                title={t("imap.list.noConfigTitle")}
                description={t("imap.list.noConfigDesc")}
            />
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("imap.list.headers.email")}</TableHead>
                        <TableHead>{t("imap.list.headers.folder")}</TableHead>
                        <TableHead>{t("imap.list.headers.filters")}</TableHead>
                        <TableHead className="text-right">
                            {t("imap.list.headers.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configs.map((config) => (
                        <TableRow key={config.id}>
                            <TableCell className="font-medium">
                                {config.email}
                            </TableCell>
                            <TableCell>{config.folder || "INBOX"}</TableCell>
                            <TableCell>
                                <div className="text-xs space-y-1">
                                    {config.sender && (
                                        <div className="flex gap-1">
                                            <span className="text-muted-foreground">
                                                {t("imap.list.from")}
                                            </span>
                                            <span>{config.sender}</span>
                                        </div>
                                    )}
                                    {config.subject && (
                                        <div className="flex gap-1">
                                            <span className="text-muted-foreground">
                                                {t("imap.list.subject")}
                                            </span>
                                            <span>{config.subject}</span>
                                        </div>
                                    )}
                                    {!config.sender && !config.subject && (
                                        <span className="text-muted-foreground italic">
                                            {t("imap.list.none")}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={t("common.edit")}
                                        onClick={() => onEdit(config)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={t("common.delete")}
                                        onClick={() => onDelete(config.id)}
                                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
