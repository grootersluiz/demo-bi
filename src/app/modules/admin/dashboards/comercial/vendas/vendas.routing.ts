import { Route } from '@angular/router';
import { VendasDashComponent } from './vendas.component';
import { VendasDashResolver, SellersResolver } from './vendas.resolver';

export const vendasDashRoutes: Route[] = [
    {
        path: '',
        component: VendasDashComponent,
        resolve: {
            vendasDash: VendasDashResolver,
            sellers: SellersResolver,
        },
    },
];
