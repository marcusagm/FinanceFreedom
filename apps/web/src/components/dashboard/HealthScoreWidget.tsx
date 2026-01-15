import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
    analyticsService,
    type HealthScore,
} from "../../services/analytics.service";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { RefreshCw } from "lucide-react";

export function HealthScoreWidget() {
    const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);

    useEffect(() => {
        loadScore();
    }, []);

    const loadScore = async () => {
        try {
            const data = await analyticsService.getHealthScore();
            setHealthScore(data);
        } catch (error) {
            console.error("Failed to load health score", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecalculate = async () => {
        setRecalculating(true);
        try {
            const data = await analyticsService.calculateHealthScore();
            setHealthScore(data);
        } catch (error) {
            console.error("Failed to recalculate", error);
        } finally {
            setRecalculating(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Saúde Financeira</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-32 bg-muted animate-pulse rounded" />
                </CardContent>
            </Card>
        );
    }

    const score = healthScore?.score || 0;

    // Determine status text/color
    let statusText = "Necessita Atenção";
    let statusColor = "text-red-500";
    if (score >= 800) {
        statusText = "Excelente";
        statusColor = "text-emerald-500";
    } else if (score >= 600) {
        statusText = "Bom";
        statusColor = "text-blue-500";
    } else if (score >= 400) {
        statusText = "Regular";
        statusColor = "text-yellow-500";
    }

    // Pie chart Data (Gauge style)
    // We want a semi-circle: 180 degrees.
    // Value part and remaining part.
    const data = [
        { name: "Score", value: score, color: "var(--primary)" }, // Will be overridden by statusColor logic if we want dynamic color
        { name: "Remaining", value: 1000 - score, color: "#e2e8f0" },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 800) return "#10b981"; // emerald-500
        if (score >= 600) return "#3b82f6"; // blue-500
        if (score >= 400) return "#eab308"; // yellow-500
        return "#ef4444"; // red-500
    };

    const activeColor = getScoreColor(score);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-semibold">
                    Saúde Financeira
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRecalculate}
                    disabled={recalculating}
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            recalculating ? "animate-spin" : ""
                        }`}
                    />
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center relative pt-0">
                <div className="w-full -mt-2" style={{ height: 192 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={85}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell key="score" fill={activeColor} />
                                <Cell key="rest" fill="#e2e8f0" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-2 text-center">
                    <div className="text-4xl font-bold">{score}</div>
                    <div className={`text-sm font-medium ${statusColor}`}>
                        {statusText}
                    </div>
                </div>

                <div className="w-full space-y-1 -mt-5 text-xs text-muted-foreground text-center">
                    <p>Score Máximo: 1000</p>
                </div>
            </CardContent>
        </Card>
    );
}
