import { useEffect, useState } from "react";
import { getHourlyRate } from "../services/simulator.service";

export function useHourlyRate() {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const data = await getHourlyRate();
                setHourlyRate(data.hourlyRate);
            } catch (error) {
                console.error("Failed to fetch hourly rate", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    return { hourlyRate, loading };
}
