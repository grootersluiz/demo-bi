export interface Group {
    id: number;
    name: string;
    description: string;
    userIds: number[];
    dashboardIds: number[];
    reportIds: number[];
}
