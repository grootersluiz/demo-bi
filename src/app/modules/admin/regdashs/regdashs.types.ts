export interface Dash {
    id: number;
    name: string;
    type: string;
    groupIds: number[];
    userIds: number[];
    reportIds: number[];
    reports: DashReport[];
}

export interface DashReport {
    reportId: number;
    sequence: number;
    style: string;
}

export interface Country {
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag {
    id?: string;
    title?: string;
}
