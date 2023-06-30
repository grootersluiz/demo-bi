import { Route } from '@angular/router';
import { LinksComponent } from 'app/modules/admin/dashboards/links/links.component';
import { LinksResolver } from 'app/modules/admin/dashboards/links/links.resolver';

export const linksRoutes: Route[] = [
    {
        path: '',
        component: LinksComponent,
        resolve: {
            data: LinksResolver,
        },
    },
];
