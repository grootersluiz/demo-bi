import { Route } from '@angular/router';
import { DreDashComponent } from './dre.component';
import { DreDashResolver, SellersResolver } from './dre.resolver';

export const dreDashRoutes: Route[] = [
    {
        path: '',
        component: DreDashComponent,
        resolve: {
            vendasDash: DreDashResolver,
            sellers: SellersResolver,
        },
    },
];
