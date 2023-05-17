import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
import { Dash, Country, Tag } from 'app/modules/admin/regdashs/regdashs.types';

@Injectable({
    providedIn: 'root',
})
export class RegdashsService {
    // Private
    private _contact: BehaviorSubject<Dash | null> = new BehaviorSubject(null);
    private _contacts: BehaviorSubject<Dash[] | null> = new BehaviorSubject(
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
    get contact$(): Observable<Dash> {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Dash[]> {
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
    getDashs(): Observable<Dash[]> {
        return this._httpClient
            .get<Dash[]>('http://10.2.1.108/v1/dashboards')
            .pipe(
                tap((dashs) => {
                    let orderedDashs = [...dashs['data']];
                    orderedDashs.sort((a, b) => a.name.localeCompare(b.name));
                    this._contacts.next(orderedDashs);
                })
            );
    }

    /**
     * Search contacts with given query
     *
     * @param name
     */
    searchDashs(name: string): Observable<Dash[]> {
        return this._httpClient
            .get<Dash[]>('http://10.2.1.108/v1/dashboards', {
                params: { name },
            })
            .pipe(
                tap((dashs) => {
                    let orderedDashs = [...dashs['data']];
                    orderedDashs.sort((a, b) => a.name.localeCompare(b.name));
                    this._contacts.next(orderedDashs);
                })
            );
    }

    /**
     * Get contact by id
     */
    getDashById(id: number): Observable<Dash> {
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
    createDash(): Observable<Dash> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<Dash>('http://10.2.1.108/v1/dashboards', {
                        name: 'Novo Dashboard',
                        type: 'dash',
                    })
                    .pipe(
                        map((newContact) => {
                            // Update the contacts with the new contact
                            this._contacts.next([newContact, ...contacts]);

                            // Return the new contact
                            return newContact;
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
    updateDash(id: number, contact: Dash): Observable<Dash> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .put<Dash>(`http://10.2.1.108/v1/dashboards/${id}`, {
                        name: contact.name,
                        type: contact.type,
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
    deleteDash(id: number): Observable<boolean> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .delete(`http://10.2.1.108/v1/dashboards/${id}`)
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
}
