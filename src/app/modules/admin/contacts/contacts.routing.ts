import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/contacts/contacts.guards';
import {
    ContactsContactResolver,
    ContactsCountriesResolver,
    ContactsResolver,
    ContactsTagsResolver,
    ContactByIdResolver,
} from 'app/modules/admin/contacts/contacts.resolvers';
import { ContactsComponent } from 'app/modules/admin/contacts/contacts.component';
import { ContactsListComponent } from 'app/modules/admin/contacts/list/list.component';
import { ContactsDetailsComponent } from 'app/modules/admin/contacts/details/details.component';
import { NewContactComponent } from 'app/modules/admin/contacts/new/new.component';
import { GroupsResolver } from '../reggroups/reggroups.resolvers';
import { DashsResolver } from '../regdashs/regdashs.resolvers';
import { ReportsResolver } from '../regreports/regreports.resolvers';

export const contactsRoutes: Route[] = [
    {
        path: '',
        component: ContactsComponent,
        resolve: {
            tags: ContactsTagsResolver,
        },
        children: [
            {
                path: '',
                component: ContactsListComponent,
                resolve: {
                    contacts: ContactsResolver,
                    countries: ContactsCountriesResolver,
                    groups: GroupsResolver,
                    dashs: DashsResolver,
                    reports: ReportsResolver,
                },
                children: [
                    {
                        path: 'editar/:id',
                        component: ContactsDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                            countries: ContactsCountriesResolver,
                            groups: GroupsResolver,
                            dashs: DashsResolver,
                            reports: ReportsResolver,
                            userId: ContactByIdResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                    {
                        path: 'new',
                        component: NewContactComponent,
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
