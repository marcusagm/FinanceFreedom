import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import * as IncomeService from "../services/income.service";

// Simple Tabs implementation
const Tabs = ({ active, onChange, children }: any) => {
    return (
        <div className="w-full">
            <div className="flex border-b mb-4">
                {children.map((child: any) => (
                    <button
                        key={child.props.value}
                        className={`px-4 py-2 font-medium text-sm transition-colors ${
                            active === child.props.value
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => onChange(child.props.value)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            {children.find((child: any) => child.props.value === active)}
        </div>
    );
};

const Tab = ({ children }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
    </div>
);

export const IncomePage = () => {
    const [activeTab, setActiveTab] = useState("sources");
    const [sources, setSources] = useState<IncomeService.IncomeSource[]>([]);
    const [workUnits, setWorkUnits] = useState<IncomeService.WorkUnit[]>([]);

    // Form State
    const [sourceForm, setSourceForm] = useState({
        name: "",
        amount: "",
        payDay: "",
    });
    const [workUnitForm, setWorkUnitForm] = useState({
        name: "",
        defaultPrice: "",
        estimatedTime: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const s = await IncomeService.getIncomeSources();
            const w = await IncomeService.getWorkUnits();
            setSources(s);
            setWorkUnits(w);
        } catch (error) {
            console.error("Failed to load income data", error);
        }
    };

    const handleAddSource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceForm.name || !sourceForm.amount || !sourceForm.payDay)
            return;
        try {
            await IncomeService.createIncomeSource({
                name: sourceForm.name,
                amount: Number(sourceForm.amount),
                payDay: Number(sourceForm.payDay),
            });
            setSourceForm({ name: "", amount: "", payDay: "" });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSource = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await IncomeService.deleteIncomeSource(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddWorkUnit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !workUnitForm.name ||
            !workUnitForm.defaultPrice ||
            !workUnitForm.estimatedTime
        )
            return;
        try {
            await IncomeService.createWorkUnit({
                name: workUnitForm.name,
                defaultPrice: Number(workUnitForm.defaultPrice),
                estimatedTime: Number(workUnitForm.estimatedTime),
            });
            setWorkUnitForm({ name: "", defaultPrice: "", estimatedTime: "" });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteWorkUnit = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await IncomeService.deleteWorkUnit(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Income Management
                </h1>
                <p className="text-muted-foreground">
                    Manage your fixed income sources and service catalog.
                </p>
            </div>

            <Tabs active={activeTab} onChange={setActiveTab}>
                <Tab value="sources" label="Fixed Sources">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>New Income Source</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleAddSource}
                                    className="flex gap-4 items-end flex-wrap"
                                >
                                    <div className="flex-1 min-w-[200px]">
                                        <Input
                                            label="Name (e.g. Salary)"
                                            value={sourceForm.name}
                                            onChange={(e) =>
                                                setSourceForm({
                                                    ...sourceForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Source Name"
                                        />
                                    </div>
                                    <div className="w-[150px]">
                                        <Input
                                            label="Amount (R$)"
                                            type="number"
                                            value={sourceForm.amount}
                                            onChange={(e) =>
                                                setSourceForm({
                                                    ...sourceForm,
                                                    amount: e.target.value,
                                                })
                                            }
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="w-[100px]">
                                        <Input
                                            label="Pay Day"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={sourceForm.payDay}
                                            onChange={(e) =>
                                                setSourceForm({
                                                    ...sourceForm,
                                                    payDay: e.target.value,
                                                })
                                            }
                                            placeholder="5"
                                        />
                                    </div>
                                    <Button type="submit">Add</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sources.map((source) => (
                                <Card key={source.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">
                                            {source.name}
                                        </CardTitle>
                                        <span className="text-sm font-bold text-emerald-500">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(source.amount)}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground mb-4">
                                            Receives on day {source.payDay}
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteSource(source.id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {sources.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                No income sources registered.
                            </p>
                        )}
                    </div>
                </Tab>

                <Tab value="workUnits" label="Service Catalog">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>New Service / Job</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleAddWorkUnit}
                                    className="flex gap-4 items-end flex-wrap"
                                >
                                    <div className="flex-1 min-w-[200px]">
                                        <Input
                                            label="Name (e.g. Logo Design)"
                                            value={workUnitForm.name}
                                            onChange={(e) =>
                                                setWorkUnitForm({
                                                    ...workUnitForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Service Name"
                                        />
                                    </div>
                                    <div className="w-[150px]">
                                        <Input
                                            label="Base Price (R$)"
                                            type="number"
                                            value={workUnitForm.defaultPrice}
                                            onChange={(e) =>
                                                setWorkUnitForm({
                                                    ...workUnitForm,
                                                    defaultPrice:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="w-[150px]">
                                        <Input
                                            label="Est. Time (Hours)"
                                            type="number"
                                            value={workUnitForm.estimatedTime}
                                            onChange={(e) =>
                                                setWorkUnitForm({
                                                    ...workUnitForm,
                                                    estimatedTime:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Hrs"
                                        />
                                    </div>
                                    <Button type="submit">Add</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {workUnits.map((unit) => (
                                <Card key={unit.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">
                                            {unit.name}
                                        </CardTitle>
                                        <span className="text-sm font-bold">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(unit.defaultPrice)}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground mb-4">
                                            Est. Time: {unit.estimatedTime}h
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteWorkUnit(unit.id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {workUnits.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                No services registered.
                            </p>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default IncomePage;
