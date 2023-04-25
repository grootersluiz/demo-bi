import { Route } from '@angular/router';
import { VendafilialComponent } from 'app/modules/admin/dashboards/vendafilial/vendafilial.component';
import { VendafilialResolver } from 'app/modules/admin/dashboards/vendafilial/vendafilial.resolvers';

export const vendafilialRoutes: Route[] = [
    {
        path: '',
        component: VendafilialComponent,
        resolve: {
            data: VendafilialResolver,
        },
    },
];
