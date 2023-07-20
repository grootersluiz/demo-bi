import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { RegreportsService } from 'app/modules/admin/regreports/regreports.service';
import {
    Reports,
    Country,
    Tag,
} from 'app/modules/admin/regreports/regreports.types';

@Injectable({
    providedIn: 'root',
})
export class ReportsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _contactsService: RegreportsService) {}

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
    ): Observable<Reports[]> {
        return this._contactsService.getReports();
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
        private _contactsService: RegreportsService,
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
    ): Observable<Reports> {
        return this._contactsService
            .getReportById(parseInt(route.paramMap.get('id')))
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

// @Injectable({
//     providedIn: 'root',
// })
// export class ContactsCountriesResolver implements Resolve<any> {
//     /**
//      * Constructor
//      */
//     constructor(private _contactsService: RegreportsService) {}

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      *
//      */
//     resolve(
//         route: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ): Observable<Country[]> {
//         return this._contactsService.getCountries();
//     }
// }

// @Injectable({
//     providedIn: 'root',
// })
// export class ContactsTagsResolver implements Resolve<any> {
//     /**
//      * Constructor
//      */
//     constructor(private _contactsService: RegreportsService) {}

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param route
//      * @param state
//      */
//     resolve(
//         route: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ): Observable<Tag[]> {
//         return this._contactsService.getTags();
//     }
// }
