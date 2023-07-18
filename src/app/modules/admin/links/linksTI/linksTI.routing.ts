import { Route } from '@angular/router';
import { LinksTIComponent } from 'app/modules/admin/links/linksTI/linksTI.component';
import { LinksTIResolver } from 'app/modules/admin/links/linksTI/linksTI.resolver';

export const linksTIRoutes: Route[] = [
    {
        path: '',
        component: LinksTIComponent,
        resolve: {
            data: LinksTIResolver,
        },
    },
];
