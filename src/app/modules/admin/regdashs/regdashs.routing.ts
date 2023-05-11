import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regdashs/regdashs.guards';
import {
    DashsDashResolver,
    DashsResolver,
} from 'app/modules/admin/regdashs/regdashs.resolvers';
import { RegdashsComponent } from 'app/modules/admin/regdashs/regdashs.component';
import { DashListComponent } from 'app/modules/admin/regdashs/list/dashlist.component';
import { DashDetailsComponent } from 'app/modules/admin/regdashs/details/dashdetails.component';

export const regdashsRoutes: Route[] = [
    {
        path: '',
        component: RegdashsComponent,
        resolve: {},
        children: [
            {
                path: '',
                component: DashListComponent,
                resolve: {
                    contacts: DashsResolver,
                },
                children: [
                    {
                        path: ':id',
                        component: DashDetailsComponent,
                        resolve: {
                            contact: DashsDashResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
