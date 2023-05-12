import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/reggroups/reggroups.guards';
import {
    GroupsGroupResolver,
    GroupsResolver,
} from 'app/modules/admin/reggroups/reggroups.resolvers';
import { ReggroupsComponent } from 'app/modules/admin/reggroups/reggroups.component';
import { GroupListComponent } from 'app/modules/admin/reggroups/list/grouplist.component';
import { GroupDetailsComponent } from 'app/modules/admin/reggroups/details/groupdetails.component';

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
                },
                children: [
                    {
                        path: ':id',
                        component: GroupDetailsComponent,
                        resolve: {
                            contact: GroupsGroupResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
