import { Route } from '@angular/router';
import { GlobalDashsComponent } from './globaldash.component';
import { GlobalDashResolver } from './globaldash.resolver';

export const globalDashRoutes: Route[] = [
    {
        path: '',
        component: GlobalDashsComponent,
        resolve: {
            globalDash: GlobalDashResolver,
        },
    },
];
