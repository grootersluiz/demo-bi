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
import { Group } from 'app/modules/admin/reggroups/reggroups.types';

@Injectable({
    providedIn: 'root',
})
export class ReggroupsService {
    // Private
    private _group: BehaviorSubject<Group | null> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<Group[] | null> = new BehaviorSubject(
        null
    );

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for group
     */
    get group$(): Observable<Group> {
        return this._group.asObservable();
    }

    /**
     * Getter for groups
     */
    get groups$(): Observable<Group[]> {
        return this._groups.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get groups
     */
    getGroups(): Observable<Group[]> {
        return this._httpClient
            .get<Group[]>('http://10.2.1.108/v1/groups')
            .pipe(
                tap((groups) => {
                    let orderedGroups = [...groups['data']];
                    orderedGroups.sort((a, b) => a.name.localeCompare(b.name));
                    this._groups.next(orderedGroups);
                })
            );
    }

    /**
     * Get group by ID
     */
    getGpById(id: number): Observable<Group> {
        return this._httpClient
            .get<Group>(`http://10.2.1.108/v1/groups/${id}`)
            .pipe(
                tap((group) => {
                    this._group.next(group);
                })
            );
    }

    /**
     * Get user by Group
     */
    getGroupsByDash(id: string): Observable<Group[]> {
        return this._httpClient
            .get<Group[]>(`http://10.2.1.108/v1/groups?dashboardId=${id}`)
            .pipe(
                tap((users) => {
                    let orderedContacts = [...users['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._groups.next(orderedContacts);
                })
            );
    }

    /**
     * Search groups with given query
     *
     * @param name
     */
    searchGroups(name: string): Observable<Group[]> {
        return this._httpClient
            .get<Group[]>('http://10.2.1.108/v1/groups')
            .pipe(
                map((groups) => {
                    // Convert the input name to lowercase
                    const searchName = name.toLowerCase();
                    // Filter groups whose name contains the searchName (case-insensitive)
                    const filteredGroups = groups['data'].filter((group) =>
                        group.name.toLowerCase().includes(searchName)
                    );
                    // Sort the filtered groups by name (case-insensitive)
                    const orderedGroups = filteredGroups.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    return orderedGroups;
                }),
                tap((groups) => {
                    this._groups.next(groups);
                })
            );
    }

    /**
     * Get group by id
     */
    getGroupById(id: number): Observable<Group> {
        return this._groups.pipe(
            take(1),
            map((groups) => {
                // Find the group
                const group = groups.find((item) => item.id === id) || null;

                // Update the group
                this._group.next(group);

                // Return the group
                return group;
            }),
            switchMap((group) => {
                if (!group) {
                    return throwError(
                        'Could not found group with id of ' + id + '!'
                    );
                }

                return of(group);
            })
        );
    }

    /**
     * Get groups by report
     */
    getGroupsByReport(id: string): Observable<Group[]> {
        return this._httpClient
            .get<Group[]>(`http://10.2.1.108/v1/groups?reportId=${id}`)
            .pipe(
                tap((users) => {
                    let orderedContacts = [...users['data']];
                    orderedContacts.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    this._groups.next(orderedContacts);
                })
            );
    }

    /**
     * Create group
     */
    createGroup(group: Group): Observable<Group> {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) =>
                this._httpClient
                    .post<Group>('http://10.2.1.108/v1/groups', {
                        name: group.name,
                        description: group.description,
                        dashboardIds: group.dashboardIds,
                        reportIds: group.reportIds,
                    })
                    .pipe(
                        map((newGroup) => {
                            // Update the groups with the new group
                            this._groups.next([newGroup, ...groups]);

                            // Return the new group
                            return newGroup;
                        })
                    )
            )
        );
    }

    /**
     * Update group
     *
     * @param id
     * @param group
     */
    updateGroup(id: number, group: Group): Observable<Group> {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) =>
                this._httpClient
                    .put<Group>(`http://10.2.1.108/v1/groups/${id}`, {
                        name: group.name,
                        description: group.description,
                        dashboardIds: group.dashboardIds,
                        reportIds: group.reportIds,
                    })
                    .pipe(
                        map((updatedGroups) => {
                            // Find the index of the updated group
                            const index = groups.findIndex(
                                (item) => item.id === id
                            );

                            // Update the group
                            groups[index] = updatedGroups;

                            // Update the groups
                            this._groups.next(groups);

                            // Return the updated group
                            return updatedGroups;
                        }),
                        switchMap((updatedGroup) =>
                            this.group$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the group if it's selected
                                    this._group.next(updatedGroup);
                                    // console.log(updatedGroup);
                                    // Return the updated group
                                    return updatedGroup;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the group
     *
     * @param id
     */
    deleteGroup(id: number): Observable<boolean> {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) =>
                this._httpClient
                    .delete(`http://10.2.1.108/v1/groups/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted group
                            const index = groups.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the group
                            groups.splice(index, 1);

                            // Update the groups
                            this._groups.next(groups);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }
}
