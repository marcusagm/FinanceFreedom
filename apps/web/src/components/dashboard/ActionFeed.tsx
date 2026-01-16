import type { ActionRecommendation } from "../../services/dashboard.service";
import { ActionCard } from "./ActionCard";
import { useTranslation } from "react-i18next";

interface ActionFeedProps {
    recommendations: ActionRecommendation[];
}

export function ActionFeed({ recommendations }: ActionFeedProps) {
    const { t } = useTranslation();
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">
                {t("dashboard.actionFeed.title")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec, index) => (
                    <ActionCard key={index} recommendation={rec} />
                ))}
            </div>
        </div>
    );
}
