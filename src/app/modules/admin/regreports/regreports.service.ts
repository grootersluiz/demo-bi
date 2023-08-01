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
import {
    Reports,
    Country,
    Tag,
} from 'app/modules/admin/regreports/regreports.types';

@Injectable({
    providedIn: 'root',
})
export class RegreportsService {
    // Private
    private _report: BehaviorSubject<Reports | null> = new BehaviorSubject(
        null
    );
    private _reports: BehaviorSubject<Reports[] | null> = new BehaviorSubject(
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
    get contact$(): Observable<Reports> {
        return this._report.asObservable();
    }

    /**
     * Getter for contacts
     */
    get reports$(): Observable<Reports[]> {
        return this._reports.asObservable();
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
    getReports(): Observable<Reports[]> {
        return this._httpClient
            .get<Reports[]>('http://10.2.1.108/v1/reports')
            .pipe(
                tap((reports) => {
                    let orderedReports = [...reports['data']];
                    orderedReports.sort((a, b) => a.name.localeCompare(b.name));
                    this._reports.next(orderedReports);
                    //console.log('lista reports', reports['data']);
                })
            );
    }

    /**
     * Get report by ID
     */
    getReportsById(id: number): Observable<Reports> {
        return this._httpClient
            .get<Reports>(`http://10.2.1.108/v1/reports/${id}`)
            .pipe(
                tap((dash) => {
                    this._report.next(dash);
                })
            );
    }

    /**
     * Search contacts with given name
     *
     * @param name
     */
    searchReports(name: string): Observable<Reports[]> {
        return this._httpClient
            .get<Reports[]>('http://10.2.1.108/v1/reports')
            .pipe(
                map((reports) => {
                    // Convert the input name to lowercase
                    const searchName = name.toLowerCase();
                    // Filter reports whose name contains the searchName (case-insensitive)
                    const filteredReports = reports['data'].filter(
                        (report) =>
                            report.name.toLowerCase().includes(searchName) ||
                            report.id.toString().includes(searchName)
                    );
                    // Sort the filtered reports by name (case-insensitive)
                    const orderedReports = filteredReports.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    return orderedReports;
                }),
                tap((orderedReports) => {
                    this._reports.next(orderedReports);
                })
            );
    }

    /**
     * Get report by id
     */
    getReportById(id: number): Observable<Reports> {
        return this._reports.pipe(
            take(1),
            map((contacts) => {
                // Find the contact
                const contact = contacts.find((item) => item.id === id) || null;

                // Update the contact
                this._report.next(contact);

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
     * Get report by group
     */
    getReportsByGroup(id: string): Observable<Reports[]> {
        return this._httpClient
            .get<Reports[]>(`http://10.2.1.108/v1/reports?groupId=${id}`)
            .pipe(
                tap((users) => {
                    let orderedContacts = [...users['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._reports.next(orderedContacts);
                })
            );
    }

    /**
     * Get reports by user
     */
    getReportsByUser(id: string): Observable<Reports[]> {
        return this._httpClient
            .get<Reports[]>(`http://10.2.1.108/v1/reports?userId=${id}`)
            .pipe(
                tap((users) => {
                    let orderedContacts = [...users['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._reports.next(orderedContacts);
                })
            );
    }

    /**
     * Create contact
     */
    createReport(report: Reports): Observable<Reports> {
        return this.reports$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .post<Reports>('http://10.2.1.108/v1/reports', {
                        name: report.name,
                        viewId: report.viewId,
                        type: report.type,
                        data: report.data,
                        groupIds: report.groupIds,
                        userIds: report.userIds,
                    })
                    .pipe(
                        map((newContact) => {
                            // Update the contacts with the new contact
                            this._reports.next([newContact, ...contacts]);

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
     * @param report
     */
    updateReport(id: number, report: Reports): Observable<Reports> {
        return this.reports$.pipe(
            take(1),
            switchMap((reports) =>
                this._httpClient
                    .put<Reports>(
                        `http://10.2.1.108/v1/reports/${id.toString()}`,
                        {
                            name: report.name,
                            viewId: report.viewId,
                            type: report.type,
                            data: report.data,
                            groupIds: report.groupIds,
                            userIds: report.userIds,
                        }
                    )
                    .pipe(
                        map((updatedReport) => {
                            // Find the index of the updated contact
                            const index = reports.findIndex(
                                (item) => item.id === id
                            );

                            const myUpdatedReport: Reports = {
                                id: updatedReport.id,
                                name: updatedReport.name,
                                viewId: report.viewId,
                                type: updatedReport.type,
                                data: updatedReport.data,
                                groupIds: updatedReport.groupIds,
                                userIds: updatedReport.userIds,
                            };

                            // Update the contact
                            reports[index] = myUpdatedReport;

                            // Update the contacts
                            this._reports.next(reports);

                            // Return the updated contact
                            return myUpdatedReport;
                        }),
                        switchMap((updatedReport) =>
                            this.contact$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the contact if it's selected
                                    this._report.next(updatedReport);

                                    // Return the updated contact
                                    return updatedReport;
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
    deleteReport(id: number): Observable<boolean> {
        return this.reports$.pipe(
            take(1),
            switchMap((contacts) =>
                this._httpClient
                    .delete(`http://10.2.1.108/v1/reports/${id.toString()}`, {})
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted contact
                            const index = contacts.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the contact
                            contacts.splice(index, 1);

                            // Update the contacts
                            this._reports.next(contacts);

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
    // getCountries(): Observable<Country[]> {
    //     return this._httpClient
    //         .get<Country[]>('api/apps/contacts/countries')
    //         .pipe(
    //             tap((countries) => {
    //                 this._countries.next(countries);
    //             })
    //         );
    // }

    /**
     * Get tags
     */
    // getTags(): Observable<Tag[]> {
    //     return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
    //         tap((tags) => {
    //             this._tags.next(tags);
    //         })
    //     );
    // }

    /**
     * Create tag
     *
     *
     */
    // createTag(tag: Tag): Observable<Tag> {
    //     return this.tags$.pipe(
    //         take(1),
    //         switchMap((tags) =>
    //             this._httpClient
    //                 .post<Tag>('api/apps/contacts/tag', { tag })
    //                 .pipe(
    //                     map((newTag) => {
    //                         // Update the tags with the new tag
    //                         this._tags.next([...tags, newTag]);

    //                         // Return new tag from observable
    //                         return newTag;
    //                     })
    //                 )
    //         )
    //     );
    // }

    /**
     * Update the tag
     *
     *
     */
    // updateTag(id: string, tag: Tag): Observable<Tag> {
    //     return this.tags$.pipe(
    //         take(1),
    //         switchMap((tags) =>
    //             this._httpClient
    //                 .patch<Tag>('api/apps/contacts/tag', {
    //                     id,
    //                     tag,
    //                 })
    //                 .pipe(
    //                     map((updatedTag) => {
    //                         // Find the index of the updated tag
    //                         const index = tags.findIndex(
    //                             (item) => item.id === id
    //                         );

    //                         // Update the tag
    //                         tags[index] = updatedTag;

    //                         // Update the tags
    //                         this._tags.next(tags);

    //                         // Return the updated tag
    //                         return updatedTag;
    //                     })
    //                 )
    //         )
    //     );
    // }

    /**
     * Delete the tag
     *
     *
     */
    // deleteTag(id: string): Observable<boolean> {
    //     return this.tags$.pipe(
    //         take(1),
    //         switchMap((tags) =>
    //             this._httpClient
    //                 .delete('api/apps/contacts/tag', { params: { id } })
    //                 .pipe(
    //                     map((isDeleted: boolean) => {
    //                         // Find the index of the deleted tag
    //                         const index = tags.findIndex(
    //                             (item) => item.id === id
    //                         );

    //                         // Delete the tag
    //                         tags.splice(index, 1);

    //                         // Update the tags
    //                         this._tags.next(tags);

    //                         // Return the deleted status
    //                         return isDeleted;
    //                     }),
    //                     filter((isDeleted) => isDeleted),
    //                     switchMap((isDeleted) =>
    //                         this.contacts$.pipe(
    //                             take(1),
    //                             map((contacts) => {
    //                                 // Iterate through the contacts
    //                                 contacts.forEach((contact) => {
    //                                     const tagIndex = contact.tags.findIndex(
    //                                         (tag) => tag === id
    //                                     );

    //                                     // If the contact has the tag, remove it
    //                                     if (tagIndex > -1) {
    //                                         contact.tags.splice(tagIndex, 1);
    //                                     }
    //                                 });

    //                                 // Return the deleted status
    //                                 return isDeleted;
    //                             })
    //                         )
    //                     )
    //                 )
    //         )
    //     );
    // }

    /**
     * Update the avatar of the given contact
     *
     *
     */
    // uploadAvatar(id: string, avatar: File): Observable<Reports> {
    //     return this.contacts$.pipe(
    //         take(1),
    //         switchMap((contacts) =>
    //             this._httpClient
    //                 .post<Reports>(
    //                     'api/apps/contacts/avatar',
    //                     {
    //                         id,
    //                         avatar,
    //                     },
    //                     {
    //                         headers: {
    //                             // eslint-disable-next-line @typescript-eslint/naming-convention
    //                             'Content-Type': avatar.type,
    //                         },
    //                     }
    //                 )
    //                 .pipe(
    //                     map((updatedContact) => {
    //                         // Find the index of the updated contact
    //                         const index = contacts.findIndex(
    //                             (item) => item.id === id
    //                         );

    //                         // Update the contact
    //                         contacts[index] = updatedContact;

    //                         // Update the contacts
    //                         this._contacts.next(contacts);

    //                         // Return the updated contact
    //                         return updatedContact;
    //                     }),
    //                     switchMap((updatedContact) =>
    //                         this.contact$.pipe(
    //                             take(1),
    //                             filter((item) => item && item.id === id),
    //                             tap(() => {
    //                                 // Update the contact if it's selected
    //                                 this._contact.next(updatedContact);

    //                                 // Return the updated contact
    //                                 return updatedContact;
    //                             })
    //                         )
    //                     )
    //                 )
    //         )
    //     );
    // }
}
