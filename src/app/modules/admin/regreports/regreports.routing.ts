import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regreports/regreports.guards';
import {
    ContactsContactResolver,
    ContactsResolver,
} from 'app/modules/admin/regreports/regreports.resolvers';
import { RegreportsComponent } from 'app/modules/admin/regreports/regreports.component';
import { ReportListComponent } from 'app/modules/admin/regreports/list/reportlist.component';
import { ReportDetailsComponent } from 'app/modules/admin/regreports/details/reportdetails.component';

export const regreportsRoutes: Route[] = [
    {
        path: '',
        component: RegreportsComponent,
        resolve: {},
        children: [
            {
                path: '',
                component: ReportListComponent,
                resolve: {
                    contacts: ContactsResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: ReportDetailsComponent,
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
