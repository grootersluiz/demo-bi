import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { RegviewsService } from 'app/modules/admin/regviews/regviews.service';
import {
    View,
    Country,
    Tag,
} from 'app/modules/admin/regviews/regviews.types';

@Injectable({
    providedIn: 'root',
})
export class ContactsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _contactsService: RegviewsService) {}

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
    ): Observable<View[]> {
        return this._contactsService.getViews();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ContactsContactResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _contactsService: RegviewsService,
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
    ): Observable<View> {
        return this._contactsService
            .getViewById(parseInt(route.paramMap.get('id')))
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

