import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { Dash, Country, Tag } from 'app/modules/admin/regdashs/regdashs.types';

@Injectable({
    providedIn: 'root',
})
export class DashsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _contactsService: RegdashsService) {}

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
    ): Observable<Dash[]> {
        return this._contactsService.getDashs();
    }
}

@Injectable({
    providedIn: 'root',
})
export class DashsDashResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _contactsService: RegdashsService,
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
    ): Observable<Dash> {
        return this._contactsService
            .getDashById(parseInt(route.paramMap.get('id')))
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

@Injectable({
    providedIn: 'root',
})
export class DbByIdResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _contactsService: RegdashsService,
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
    ): Observable<Dash> {
        return this._contactsService
            .getDbById(parseInt(route.paramMap.get('id')))
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
