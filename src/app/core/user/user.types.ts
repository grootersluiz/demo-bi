export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    role: string;
    groupIds: number[];
    dashboardIds: number[];
}
