import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/Tabs";
import {
    getIncomeSources,
    getWorkUnits,
    deleteIncomeSource,
    deleteWorkUnit,
    type IncomeSource,
    type WorkUnit,
} from "../services/income.service";
import { IncomeSourceCard } from "../components/income/IncomeSourceCard";
import { WorkUnitCard } from "../components/income/WorkUnitCard";
import { CreateIncomeSourceDialog } from "../components/income/CreateIncomeSourceDialog";
import { CreateWorkUnitDialog } from "../components/income/CreateWorkUnitDialog";
import { DeleteIncomeDialog } from "../components/income/DeleteIncomeDialog";

export default function IncomePage() {
    const [activeTab, setActiveTab] = useState("sources");
    const [sources, setSources] = useState<IncomeSource[]>([]);
    const [workUnits, setWorkUnits] = useState<WorkUnit[]>([]);

    // Dialog States
    const [isCreateSourceOpen, setIsCreateSourceOpen] = useState(false);
    const [isCreateWorkUnitOpen, setIsCreateWorkUnitOpen] = useState(false);

    // Edit States
    const [sourceToEdit, setSourceToEdit] = useState<IncomeSource | null>(null);
    const [workUnitToEdit, setWorkUnitToEdit] = useState<WorkUnit | null>(null);

    // Delete States
    const [itemToDelete, setItemToDelete] = useState<{
        id: string;
        name: string;
        type: "SOURCE" | "WORK_UNIT";
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const s = await getIncomeSources();
            const w = await getWorkUnits();
            setSources(s);
            setWorkUnits(w);
        } catch (error) {
            console.error("Failed to load income data", error);
        }
    };

    // --- Income Source Handlers ---
    const handleEditSource = (source: IncomeSource) => {
        setSourceToEdit(source);
        setIsCreateSourceOpen(true);
    };

    const handleDeleteSourceClick = (source: IncomeSource) => {
        setItemToDelete({ id: source.id, name: source.name, type: "SOURCE" });
    };

    // --- Work Unit Handlers ---
    const handleEditWorkUnit = (unit: WorkUnit) => {
        setWorkUnitToEdit(unit);
        setIsCreateWorkUnitOpen(true);
    };

    const handleDeleteWorkUnitClick = (unit: WorkUnit) => {
        setItemToDelete({ id: unit.id, name: unit.name, type: "WORK_UNIT" });
    };

    // --- Confirm Delete ---
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            if (itemToDelete.type === "SOURCE") {
                await deleteIncomeSource(itemToDelete.id);
            } else {
                await deleteWorkUnit(itemToDelete.id);
            }
            loadData();
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete item", error);
            alert("Erro ao excluir item.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateClick = () => {
        if (activeTab === "sources") {
            setSourceToEdit(null);
            setIsCreateSourceOpen(true);
        } else {
            setWorkUnitToEdit(null);
            setIsCreateWorkUnitOpen(true);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <PageHeader
                title="Renda"
                description="Gerencie suas fontes de renda fixa e catálogo de serviços."
                actions={
                    <Button onClick={handleCreateClick}>
                        {activeTab === "sources"
                            ? "+ Nova Fonte"
                            : "+ Novo Serviço"}
                    </Button>
                }
            />

            <Tabs
                defaultValue="sources"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList>
                    <TabsTrigger value="sources">Fontes Fixas</TabsTrigger>
                    <TabsTrigger value="workUnits">
                        Catálogo de Serviços
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sources">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sources.map((source) => (
                            <IncomeSourceCard
                                key={source.id}
                                source={source}
                                onEdit={handleEditSource}
                                onDelete={handleDeleteSourceClick}
                            />
                        ))}
                    </div>
                    {sources.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border rounded-lg bg-card/50">
                            Nenhuma fonte de renda cadastrada. Adicione seu
                            salário ou renda recorrente!
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="workUnits">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {workUnits.map((unit) => (
                            <WorkUnitCard
                                key={unit.id}
                                unit={unit}
                                onEdit={handleEditWorkUnit}
                                onDelete={handleDeleteWorkUnitClick}
                            />
                        ))}
                    </div>
                    {workUnits.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border rounded-lg bg-card/50">
                            Nenhum serviço cadastrado. Liste seus serviços de
                            freelance aqui!
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <CreateIncomeSourceDialog
                isOpen={isCreateSourceOpen}
                onClose={() => setIsCreateSourceOpen(false)}
                onSuccess={loadData}
                itemToEdit={sourceToEdit}
            />

            <CreateWorkUnitDialog
                isOpen={isCreateWorkUnitOpen}
                onClose={() => setIsCreateWorkUnitOpen(false)}
                onSuccess={loadData}
                itemToEdit={workUnitToEdit}
            />

            <DeleteIncomeDialog
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name || ""}
                itemType={itemToDelete?.type || "SOURCE"}
                isDeleting={isDeleting}
            />
        </div>
    );
}
