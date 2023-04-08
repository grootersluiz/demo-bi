import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regdashs/regdashs.guards';
import {
    ContactsContactResolver,
    ContactsCountriesResolver,
    ContactsResolver,
    ContactsTagsResolver,
} from 'app/modules/admin/regdashs/regdashs.resolvers';
import { RegdashsComponent } from 'app/modules/admin/regdashs/regdashs.component';
import { DashListComponent } from 'app/modules/admin/regdashs/list/dashlist.component';
import { DashDetailsComponent } from 'app/modules/admin/regdashs/details/dashdetails.component';

export const regdashsRoutes: Route[] = [
    {
        path: '',
        component: RegdashsComponent,
        resolve: {
            tags: ContactsTagsResolver,
        },
        children: [
            {
                path: '',
                component: DashListComponent,
                resolve: {
                    contacts: ContactsResolver,
                    countries: ContactsCountriesResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: DashDetailsComponent,
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
