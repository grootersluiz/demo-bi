import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { LinksTIService } from 'app/modules/admin/links/linksTI/linksTI.service';

@Injectable({
    providedIn: 'root',
})
export class LinksTIResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _linkstiservice: LinksTIService) {}

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
    constructor(private _linkstiservice: LinksTIService) {}

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
