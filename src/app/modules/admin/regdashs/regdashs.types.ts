export interface Dash {
    id: number;
    name: string;
    type: string;
    groupIds: number[];
    userIds: number[];
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
