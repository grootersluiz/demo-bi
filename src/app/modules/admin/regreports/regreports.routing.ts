import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regreports/regreports.guards';
import {
    ContactsContactResolver,
    ContactsCountriesResolver,
    ContactsResolver,
    ContactsTagsResolver,
} from 'app/modules/admin/regreports/regreports.resolvers';
import { RegreportsComponent } from 'app/modules/admin/regreports/regreports.component';
import { ReportListComponent } from 'app/modules/admin/regreports/list/reportlist.component';
import { ReportDetailsComponent } from 'app/modules/admin/regreports/details/reportdetails.component';

export const regreportsRoutes: Route[] = [
    {
        path: '',
        component: RegreportsComponent,
        resolve: {
            tags: ContactsTagsResolver,
        },
        children: [
            {
                path: '',
                component: ReportListComponent,
                resolve: {
                    contacts: ContactsResolver,
                    countries: ContactsCountriesResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: ReportDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                            countries: ContactsCountriesResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
