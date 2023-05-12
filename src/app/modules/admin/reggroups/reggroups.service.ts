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
import { Group, Country, Tag } from 'app/modules/admin/reggroups/reggroups.types';

@Injectable({
    providedIn: 'root',
})
export class ReggroupsService {
    // Private
    private _group: BehaviorSubject<Group | null> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<Group[] | null> = new BehaviorSubject(
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
     * Search groups with given query
     *
     * @param name
     */
    searchGroups(name: string): Observable<Group[]> {
        return this._httpClient
            .get<Group[]>('http://10.2.1.108/v1/groups', {
                params: { name },
            })
            .pipe(
                tap((groups) => {
                    let orderedGroups = [...groups['data']];
                    orderedGroups.sort((a, b) => a.name.localeCompare(b.name));
                    this._groups.next(orderedGroups);
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
     * Create group
     */
    createGroup(): Observable<Group> {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) =>
                this._httpClient
                    .post<Group>('http://10.2.1.108/v1/groups', {
                        name: "Novo Grupo",
                        description: "grupo"
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
