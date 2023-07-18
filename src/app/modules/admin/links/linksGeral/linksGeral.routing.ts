import { Route } from '@angular/router';
import { LinksGeralComponent } from 'app/modules/admin/links/linksGeral/linksGeral.component';
import { LinksGeralResolver } from 'app/modules/admin/links/linksGeral/linksGeral.resolver';

export const linksGeralRoutes: Route[] = [
    {
        path: '',
        component: LinksGeralComponent,
        resolve: {
            data: LinksGeralResolver,
        },
    },
];
