import { Route } from '@angular/router';
import { AnalisemarcaComponent } from 'app/modules/admin/dashboards/analisemarca/analisemarca.component';
import { AnalisemarcaResolver } from 'app/modules/admin/dashboards/analisemarca/analisemarca.resolvers';

export const analisemarcaRoutes: Route[] = [
    {
        path: '',
        component: AnalisemarcaComponent,
        resolve: {
            data: AnalisemarcaResolver,
        },
    },
];
