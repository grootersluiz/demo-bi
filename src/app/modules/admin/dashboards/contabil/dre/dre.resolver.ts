import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DreDashService } from './dre.service';

@Injectable({
    providedIn: 'root',
})
export class DreDashResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _dredashService: DreDashService) {}

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
    ): Observable<any> {
        return this._dredashService.getData(
            this._dredashService.INITIAL_INITIAL_DATE,
            this._dredashService.INITIAL_FINAL_DATE,
            this._dredashService.INITIAL_COMPANIES_IDS,
            this._dredashService.INITIAL_SELLERS_IDS
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class SellersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _dredashService: DreDashService) {}

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
    ): Observable<any> {
        return this._dredashService.getSellersData(
            this._dredashService.INITIAL_INITIAL_DATE,
            this._dredashService.INITIAL_FINAL_DATE,
            this._dredashService.INITIAL_COMPANIES_IDS
        );
    }
}
