export interface User
{
    id: number,
    name: string,
    emails: string[],
    role: string,
    isAd: boolean
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}
