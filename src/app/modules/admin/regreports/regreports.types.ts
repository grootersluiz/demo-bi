export interface Reports {
    id: number;
    name: string;
    viewId: number;
    type: string;
    data: string;
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
