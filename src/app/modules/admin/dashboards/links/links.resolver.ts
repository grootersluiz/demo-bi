import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { LinksService } from 'app/modules/admin/dashboards/links/links.service';

@Injectable({
    providedIn: 'root',
})
export class LinksResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _linksservice: LinksService) {}

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

@Injectable({
    providedIn: 'root',
})
export class SellersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _linksservice: LinksService) {}

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
