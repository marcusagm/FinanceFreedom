import { api } from "../lib/api";

export interface IncomeSource {
    id: string;
    name: string;
    amount: number;
    payDay: number;
}

export interface WorkUnit {
    id: string;
    name: string;
    defaultPrice: number;
    estimatedTime: number;
}

export interface CreateIncomeSourceDto {
    name: string;
    amount: number;
    payDay: number;
}

export interface CreateWorkUnitDto {
    name: string;
    defaultPrice: number;
    estimatedTime: number;
}

export const getIncomeSources = async () => {
    const response = await api.get<IncomeSource[]>("/income/sources");
    return response.data;
};

export const createIncomeSource = async (data: CreateIncomeSourceDto) => {
    const response = await api.post<IncomeSource>("/income/sources", data);
    return response.data;
};

export const deleteIncomeSource = async (id: string) => {
    await api.delete(`/income/sources/${id}`);
};

export const getWorkUnits = async () => {
    const response = await api.get<WorkUnit[]>("/income/work-units");
    return response.data;
};

export const createWorkUnit = async (data: CreateWorkUnitDto) => {
    const response = await api.post<WorkUnit>("/income/work-units", data);
    return response.data;
};

export const deleteWorkUnit = async (id: string) => {
    await api.delete(`/income/work-units/${id}`);
};
