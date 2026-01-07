import { api } from "../lib/api";

export interface HourlyRateResponse {
    hourlyRate: number;
}

export interface DelayCostResponse {
    debtName: string;
    daysLate: number;
    fine: number;
    interest: number;
    totalCost: number;
    comparison: string;
}

export interface PrepaymentSavingsResponse {
    prepaymentAmount: number;
    interestSaved: number;
    monthsSaved: number;
    message?: string;
}

export const getHourlyRate = async (): Promise<HourlyRateResponse> => {
    const response = await api.get<HourlyRateResponse>(
        "/simulators/hourly-rate"
    );
    return response.data;
};

export const calculateDelayCost = async (
    accountId: string,
    daysLate: number
): Promise<DelayCostResponse> => {
    const response = await api.post<DelayCostResponse>(
        "/simulators/delay-cost",
        { accountId, daysLate }
    );
    return response.data;
};

export const calculatePrepaymentSavings = async (
    accountId: string,
    prepaymentAmount: number
): Promise<PrepaymentSavingsResponse> => {
    const response = await api.post<PrepaymentSavingsResponse>(
        "/simulators/prepayment-savings",
        { accountId, prepaymentAmount }
    );
    return response.data;
};
