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
    debtBalance: number,
    monthlyInterestRate: number,
    daysLate: number
): Promise<DelayCostResponse> => {
    const response = await api.post<DelayCostResponse>(
        "/simulators/delay-cost",
        { debtBalance, monthlyInterestRate, daysLate }
    );
    return response.data;
};

export const calculatePrepaymentSavings = async (
    debtBalance: number,
    monthlyInterestRate: number,
    minimumPayment: number,
    prepaymentAmount: number
): Promise<PrepaymentSavingsResponse> => {
    const response = await api.post<PrepaymentSavingsResponse>(
        "/simulators/prepayment-savings",
        { debtBalance, monthlyInterestRate, minimumPayment, prepaymentAmount }
    );
    return response.data;
};

export const calculateTimeCost = async (
    amount: number,
    hourlyRate: number
): Promise<{ timeCost: number }> => {
    const response = await api.post<{ timeCost: number }>(
        "/simulators/time-cost",
        { amount, hourlyRate }
    );
    return response.data;
};
