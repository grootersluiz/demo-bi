import { Route } from '@angular/router';
import { SettingsComponent } from 'app/modules/admin/settings/settings.component';

export const userRoutes: Route[] = [
    {
        path: '',
        component: SettingsComponent,
    },
];
