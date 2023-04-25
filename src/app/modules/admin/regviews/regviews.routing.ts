import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regviews/regviews.guards';
import {
    ContactsContactResolver,
    ContactsResolver,
} from 'app/modules/admin/regviews/regviews.resolvers';
import { RegviewsComponent } from 'app/modules/admin/regviews/regviews.component';
import { ViewListComponent } from 'app/modules/admin/regviews/list/viewlist.component';
import { ViewDetailsComponent } from 'app/modules/admin/regviews/details/viewdetails.component';

export const regviewsRoutes: Route[] = [
    {
        path: '',
        component: RegviewsComponent,
        resolve: {},
        children: [
            {
                path: '',
                component: ViewListComponent,
                resolve: {
                    contacts: ContactsResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: ViewDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
