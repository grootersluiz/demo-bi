import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, Country, Tag } from 'app/modules/admin/contacts/contacts.types';

@Injectable({
    providedIn: 'root',
})
export class ContactsService {
    // Private
    private _contact: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _contacts: BehaviorSubject<User[] | null> = new BehaviorSubject(
        null
    );
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(
        null
    );
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<User> {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<User[]> {
        return this._contacts.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]> {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
    getContacts(): Observable<User[]> {
        return this._httpClient.get<any>('http://10.2.1.108/v1/users').pipe(
            tap((contacts) => {
                let orderedContacts = [...contacts['data']];
                orderedContacts.sort((a, b) => a.name.localeCompare(b.name));

                /*                 const myContacts = contacts.data.map((contact => ({
                    id: contact.id,
                    avatar: null,
                    background: null,
                    name: contact.name,
                    emails: [contact.email],
                    tags: []
                } as User)));  */

                this._contacts.next(orderedContacts);
            })
        );
    }

    /**
     * Get user by Group
     */
    getUsersByGroup(id: string): Observable<User[]> {
        return this._httpClient
            .get<User[]>(`http://10.2.1.108/v1/users?groupId=${id}`)
            .pipe(
                tap((users) => {
                    let orderedContacts = [...users['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._contacts.next(orderedContacts);
                })
            );
    }

    /**
     * Get user by ID
     */
    getUserById(id: number): Observable<User> {
        return this._httpClient
            .get<User>(`http://10.2.1.108/v1/users/${id.toString()}`)
            .pipe(
                tap((user) => {
                    this._contact.next(user);
                })
            );
    }

    /**
     * Search contacts with given query
     *
     * @param query
     */
    searchContacts(name: string): Observable<User[]> {
        return this._httpClient
            .get<User[]>('http://10.2.1.108/v1/users', {
                params: { name },
            })
            .pipe(
                tap((contacts) => {
                    let orderedContacts = [...contacts['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._contacts.next(orderedContacts);
                })
            );
    }

    /**
     * Get contact by id
     */
    getContactById(id: number): Observable<User> {
        return this._contacts.pipe(
            take(1),
            map((contacts) => {
                // Find the contact
                const contact = contacts.find((item) => item.id === id) || null;
                // Update the contact
                this._contact.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) => {
                if (!contact) {
                    return throwError(
                        'Could not found contact with id of ' + id + '!'
                    );
                }

                return of(contact);
            })
        );
    }

    /**
     * Create contact
     */
    createContact(): Observable<User> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<User>('http://10.2.1.108/v1/users', {
                        name: 'Novo Usuário',
                        email: 'user@mail.com',
                        password: '123',
                        role: 'user',
                    })
                    .pipe(
                        map((newContact) => {
                            // Update the contacts with the new contact
                            this._contacts.next([newContact, ...contacts]);

                            // Return the new contact
                            return newContact;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            // Handle the error and access the response
                            console.error('Error:', error);
                            console.log('Response:', error.error); // Access the response here

                            // Rethrow the error to propagate it further
                            return throwError(error);
                        })
                    )
            )
        );
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: number, contact: User): Observable<User> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .put<User>(`http://10.2.1.108/v1/users/${id.toString()}`, {
                        name: contact.name,
                        email: contact.email,
                        role: contact.role,
                        password:
                            contact.password != ''
                                ? contact.password
                                : undefined,
                        groupIds: contact.groupIds,
                        dashboardIds: contact.dashboardIds,
                    })
                    .pipe(
                        map((updatedContact) => {
                            // Find the index of the updated contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Update the contact
                            contacts[index] = updatedContact;

                            // Update the contacts
                            this._contacts.next(contacts);

                            // Return the updated contact
                            return updatedContact;
                        }),
                        switchMap((updatedContact) =>
                            this.contact$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the contact if it's selected
                                    this._contact.next(updatedContact);

                                    // Return the updated contact
                                    return updatedContact;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: number): Observable<boolean> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .delete(`http://10.2.1.108/v1/users/${id.toString()}`, {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the contact
                            contacts.splice(index, 1);

                            // Update the contacts
                            this._contacts.next(contacts);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]> {
        return this._httpClient
            .get<Country[]>('api/apps/contacts/countries')
            .pipe(
                tap((countries) => {
                    this._countries.next(countries);
                })
            );
    }

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]> {
        return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<Tag>('api/apps/contacts/tag', { tag })
                    .pipe(
                        map((newTag) => {
                            // Update the tags with the new tag
                            this._tags.next([...tags, newTag]);

                            // Return new tag from observable
                            return newTag;
                        })
                    )
            )
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<User> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<User>(
                        'api/apps/contacts/avatar',
                        {
                            id,
                            avatar,
                        },
                        {
                            headers: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'Content-Type': avatar.type,
                            },
                        }
                    )
                    .pipe(
                        map((updatedContact) => {
                            // Find the index of the updated contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Update the contact
                            contacts[index] = updatedContact;

                            // Update the contacts
                            this._contacts.next(contacts);

                            // Return the updated contact
                            return updatedContact;
                        }),
                        switchMap((updatedContact) =>
                            this.contact$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the contact if it's selected
                                    this._contact.next(updatedContact);

                                    // Return the updated contact
                                    return updatedContact;
                                })
                            )
                        )
                    )
            )
        );
    }
}
