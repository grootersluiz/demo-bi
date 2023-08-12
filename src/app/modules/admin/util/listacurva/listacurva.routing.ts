import { Route } from '@angular/router';
import { ListacurvaComponent } from './listacurva.component';
import { ListacurvaResolver } from './listacurva.resolver';

export const selectfilialRoutes: Route[] = [
    {
        path: '',
        component: ListacurvaComponent,
        resolve: {
            data: ListacurvaResolver,
            // sellers: SellersResolver
        },
    },
];
