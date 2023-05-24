import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/regreports/regreports.guards';
import {
    ContactsContactResolver,
    ContactsResolver,
} from 'app/modules/admin/regreports/regreports.resolvers';
import { RegreportsComponent } from 'app/modules/admin/regreports/regreports.component';
import { ReportListComponent } from 'app/modules/admin/regreports/list/reportlist.component';
import { ReportDetailsComponent } from 'app/modules/admin/regreports/details/reportdetails.component';
import { NewReportComponent } from './new/newreport.component';

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
                        path: 'editar/:id',
                        component: ReportDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                    {
                        path: 'new',
                        component: NewReportComponent,
                        resolve: {},
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
