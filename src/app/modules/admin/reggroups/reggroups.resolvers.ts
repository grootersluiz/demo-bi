import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ReggroupsService } from 'app/modules/admin/reggroups/reggroups.service';
import { Group } from 'app/modules/admin/reggroups/reggroups.types';

@Injectable({
    providedIn: 'root',
})
export class GroupsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _groupsService: ReggroupsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Group[]> {
        return this._groupsService.getGroups();
    }
}

@Injectable({
    providedIn: 'root',
})
export class GroupsGroupResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _groupsService: ReggroupsService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Group> {
        return this._groupsService
            .getGroupById(parseInt(route.paramMap.get('id')))
            .pipe(
                // Error here means the requested contact is not available
                catchError((error) => {
                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url
                        .split('/')
                        .slice(0, -1)
                        .join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}
