export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    isAd: boolean;
    groupIds: number[];
    dashboardIds: number[];
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
