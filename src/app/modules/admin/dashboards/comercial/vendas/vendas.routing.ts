import { Route } from '@angular/router';
import { VendasDashComponent } from './vendas.component';
import { VendasDashResolver } from './vendas.resolver';

export const vendasDashRoutes: Route[] = [
    {
        path: '',
        component: VendasDashComponent,
        resolve: {
            vendasDash: VendasDashResolver,
        },
    },
];
