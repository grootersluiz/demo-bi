import { Route } from '@angular/router';
import { RolComponent } from 'app/modules/admin/dashboards/rol/rol.component';
import { RolResolver } from 'app/modules/admin/dashboards/rol/rol.resolvers';

export const rolRoutes: Route[] = [
    {
        path: '',
        component: RolComponent,
        resolve: {
            data: RolResolver,
        },
    },
];
