import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { LinksGeralService } from 'app/modules/admin/links/linksGeral/linksGeral.service';

@Injectable({
    providedIn: 'root',
})
export class LinksGeralResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _linksgeralservice: LinksGeralService) {}

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
    constructor(private _linksgeralservice: LinksGeralService) {}

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
