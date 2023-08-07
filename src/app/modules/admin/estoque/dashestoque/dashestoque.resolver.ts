import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { DashEstoqueService } from './dashestoque.service';


@Injectable({
    providedIn: 'root',
})
export class DashEstoqueResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _dashestoqueservice: DashEstoqueService) {}

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
    constructor(private _dashestoque: DashEstoqueService) {}

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
