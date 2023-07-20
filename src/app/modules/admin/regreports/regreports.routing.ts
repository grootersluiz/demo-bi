import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regreports/regreports.guards';
import {
    ContactsContactResolver,
    ReportsResolver,
} from 'app/modules/admin/regreports/regreports.resolvers';
import { RegreportsComponent } from 'app/modules/admin/regreports/regreports.component';
import { ReportListComponent } from 'app/modules/admin/regreports/list/reportlist.component';
import { ReportDetailsComponent } from 'app/modules/admin/regreports/details/reportdetails.component';
import { NewReportComponent } from './new/newreport.component';
import { GroupsResolver } from '../reggroups/reggroups.resolvers';
import { ContactsResolver } from '../contacts/contacts.resolvers';

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
                    contacts: ReportsResolver,
                    groups: GroupsResolver,
                    users: ContactsResolver,
                },
                children: [
                    {
                        path: 'editar/:id',
                        component: ReportDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                            groups: GroupsResolver,
                            users: ContactsResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                    {
                        path: 'new',
                        component: NewReportComponent,
                        resolve: {
                            groups: GroupsResolver,
                            users: ContactsResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
