export interface WorkDays {
    id: number;
    employee: string;
    department: string;
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}

export interface WorkDaysCreateRequest {
    employee: string;
    department: string;
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}

export interface WorkDaysUpdateRequest extends Partial<WorkDaysCreateRequest> {
    id: number;
}

export interface WorkDaysFilterOptions {
    employee?: string;
    department?: string;
    month?: keyof Pick<WorkDays, 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december'>;
    minDays?: number;
    maxDays?: number;
}
