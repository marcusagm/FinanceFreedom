import { Edit, Trash2 } from "lucide-react";
import type React from "react";
import { AppAlert } from "../ui/AppAlert";
import { Button } from "../ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

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

export const ImapConfigList: React.FC<ImapConfigListProps> = ({ configs, onEdit, onDelete }) => {
    if (configs.length === 0) {
        return (
            <AppAlert
                variant="default"
                title="No Configuration"
                description="No IMAP configurations found for this account. Add one to start syncing."
            />
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Folder</TableHead>
                        <TableHead>Filters</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configs.map((config) => (
                        <TableRow key={config.id}>
                            <TableCell className="font-medium">{config.email}</TableCell>
                            <TableCell>{config.folder || "INBOX"}</TableCell>
                            <TableCell>
                                <div className="text-xs space-y-1">
                                    {config.sender && (
                                        <div className="flex gap-1">
                                            <span className="text-muted-foreground">From:</span>
                                            <span>{config.sender}</span>
                                        </div>
                                    )}
                                    {config.subject && (
                                        <div className="flex gap-1">
                                            <span className="text-muted-foreground">Subject:</span>
                                            <span>{config.subject}</span>
                                        </div>
                                    )}
                                    {!config.sender && !config.subject && (
                                        <span className="text-muted-foreground italic">None</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Edit"
                                        onClick={() => onEdit(config)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Delete"
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
