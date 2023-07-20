import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { GlobalDashService } from './globaldash.service';

@Injectable({
    providedIn: 'root',
})
export class GlobalDashResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _globaldashService: GlobalDashService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return;
    }
}
