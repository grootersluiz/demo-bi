import { Route } from '@angular/router';
import { GlobalDashsComponent } from './globaldash.component';
import { GlobalDashResolver, GetDashResolver } from './globaldash.resolver';

export const globalDashRoutes: Route[] = [
    {
        path: '',
        component: GlobalDashsComponent,
        resolve: {
            globalDash: GlobalDashResolver,
            dashID: GetDashResolver,
        },
    },
];
