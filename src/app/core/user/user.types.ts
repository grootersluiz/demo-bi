export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    role: string;
    groupIds: number[];
    dashboardIds: number[];
}
