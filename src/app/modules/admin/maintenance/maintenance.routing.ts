import { Route } from '@angular/router';
import { MaintenanceComponent } from 'app/modules/admin/maintenance/maintenance.component';

export const maintenanceRoutes: Route[] = [
    {
        path: '',
        component: MaintenanceComponent,
    },
];
