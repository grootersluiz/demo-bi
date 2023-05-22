import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/contacts/contacts.guards';
import {
    ContactsContactResolver,
    ContactsCountriesResolver,
    ContactsResolver,
    ContactsTagsResolver,
} from 'app/modules/admin/contacts/contacts.resolvers';
import { ContactsComponent } from 'app/modules/admin/contacts/contacts.component';
import { ContactsListComponent } from 'app/modules/admin/contacts/list/list.component';
import { ContactsDetailsComponent } from 'app/modules/admin/contacts/details/details.component';
import { GroupsResolver } from '../reggroups/reggroups.resolvers';

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
                },
                children: [
                    {
                        path: ':id',
                        component: ContactsDetailsComponent,
                        resolve: {
                            contact: ContactsContactResolver,
                            countries: ContactsCountriesResolver,
                            groups: GroupsResolver,
                        },
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
];
