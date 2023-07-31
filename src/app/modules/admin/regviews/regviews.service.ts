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
import { View, Country, Tag } from 'app/modules/admin/regviews/regviews.types';

@Injectable({
    providedIn: 'root',
})
export class RegviewsService {
    // Private
    private _view: BehaviorSubject<View | null> = new BehaviorSubject(null);
    private _views: BehaviorSubject<View[] | null> = new BehaviorSubject(null);
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
    get contact$(): Observable<View> {
        return this._view.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<View[]> {
        return this._views.asObservable();
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
     * Get views
     */
    getViews(): Observable<View[]> {
        return this._httpClient.get<View[]>('http://10.2.1.108/v1/views').pipe(
            tap((views) => {
                //arrayOfObjects.sort((a, b) => a.name.localeCompare(b.name));
                let orderedViews = [...views['data']];
                orderedViews.sort((a, b) => a.name.localeCompare(b.name));
                this._views.next(orderedViews);
            })
        );
    }

    /**
     * Search contacts with given query
     *
     */
    searchViews(name: string): Observable<View[]> {
        return this._httpClient.get<View[]>('http://10.2.1.108/v1/views').pipe(
            map((views) => {
                // Convert the input name to lowercase
                const searchName = name.toLowerCase();
                // Filter views whose name contains the searchName (case-insensitive)
                const filteredViews = views['data'].filter(
                    (view) =>
                        view.name.toLowerCase().includes(searchName) ||
                        view.id.toString().includes(searchName)
                );
                // Sort the filtered views by name (case-insensitive)
                const orderedViews = filteredViews.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                return orderedViews;
            }),
            tap((orderedViews) => {
                this._views.next(orderedViews);
            })
        );
    }

    /**
     * Get contact by id
     */
    getViewById(id: number): Observable<View> {
        return this._views.pipe(
            take(1),
            map((contacts) => {
                // Find the contact
                const contact = contacts.find((item) => item.id === id) || null;

                // Update the contact
                this._view.next(contact);

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
    createView(view: View): Observable<View> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<View>('http://10.2.1.108/v1/views', {
                        name: view.name,
                        query: view.query,
                    })
                    .pipe(
                        map((newContact) => {
                            // Update the contacts with the new contact
                            this._views.next([newContact, ...contacts]);

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
    updateView(id: number, contact: View): Observable<View> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .put<View>(`http://10.2.1.108/v1/views/${id.toString()}`, {
                        name: contact.name,
                        query: contact.query,
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
                            this._views.next(contacts);

                            // Return the updated contact
                            return updatedContact;
                        }),
                        switchMap((updatedContact) =>
                            this.contact$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the contact if it's selected
                                    this._view.next(updatedContact);

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
    deleteView(id: number): Observable<boolean> {
        return this.contacts$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .delete(`http://10.2.1.108/v1/views/${id.toString()}`, {})
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the contact
                            contacts.splice(index, 1);

                            // Update the contacts
                            this._views.next(contacts);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }
}
