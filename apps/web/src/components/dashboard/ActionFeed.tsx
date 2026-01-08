import type { ActionRecommendation } from "../../services/dashboard.service";
import { ActionCard } from "./ActionCard";

interface ActionFeedProps {
    recommendations: ActionRecommendation[];
}

export function ActionFeed({ recommendations }: ActionFeedProps) {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">
                Recommended Actions
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec, index) => (
                    <ActionCard key={index} recommendation={rec} />
                ))}
            </div>
        </div>
    );
}
