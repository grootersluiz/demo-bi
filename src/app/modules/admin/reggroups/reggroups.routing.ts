import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/reggroups/reggroups.guards';
import {
    GroupsGroupResolver,
    GroupsResolver,
    GpByIdResolver,
} from 'app/modules/admin/reggroups/reggroups.resolvers';
import { ReggroupsComponent } from 'app/modules/admin/reggroups/reggroups.component';
import { GroupListComponent } from 'app/modules/admin/reggroups/list/grouplist.component';
import { GroupDetailsComponent } from 'app/modules/admin/reggroups/details/groupdetails.component';
import { NewGroupComponent } from './new/newgroup.component';
import { DashsResolver } from '../regdashs/regdashs.resolvers';
import { ReportsResolver } from '../regreports/regreports.resolvers';

export const reggroupsRoutes: Route[] = [
    {
        path: '',
        component: ReggroupsComponent,
        resolve: {},
        children: [
            {
                path: '',
                component: GroupListComponent,
                resolve: {
                    contacts: GroupsResolver,
                    dashs: DashsResolver,
                    reports: ReportsResolver,
                },
                children: [
                    {
                        path: 'editar/:id',
                        component: GroupDetailsComponent,
                        resolve: {
                            contact: GroupsGroupResolver,
                            dashs: DashsResolver,
                            groups: GpByIdResolver,
                            reports: ReportsResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                    {
                        path: 'new',
                        component: NewGroupComponent,
                        resolve: {
                            groups: GroupsResolver,
                            dashs: DashsResolver,
                            reports: ReportsResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
