import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regdashs/regdashs.guards';
import {
    DashsDashResolver,
    DashsResolver,
    DbByIdResolver,
} from 'app/modules/admin/regdashs/regdashs.resolvers';
import { RegdashsComponent } from 'app/modules/admin/regdashs/regdashs.component';
import { DashListComponent } from 'app/modules/admin/regdashs/list/dashlist.component';
import { DashDetailsComponent } from 'app/modules/admin/regdashs/details/dashdetails.component';
import { GroupsResolver } from '../reggroups/reggroups.resolvers';

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
                            groups: GroupsResolver,
                            dashsId: DbByIdResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
