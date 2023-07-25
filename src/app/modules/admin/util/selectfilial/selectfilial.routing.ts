import { Route } from '@angular/router';
import { SelectfilialComponent } from './selectfilial.component';
import { SelectfilialResolver } from './selectfilial.resolver';

export const selectfilialRoutes: Route[] = [
    {
        path: '',
        component: SelectfilialComponent,
        resolve: {
            data: SelectfilialResolver,
            // sellers: SellersResolver
        },
    },
];
