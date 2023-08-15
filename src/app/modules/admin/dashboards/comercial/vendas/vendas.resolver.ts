import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { VendasDashService } from './vendas.service';

@Injectable({
    providedIn: 'root',
})
export class VendasDashResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _vendasdashService: VendasDashService) {}

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
        return this._vendasdashService.getData(
            this._vendasdashService.INITIAL_INITIAL_DATE,
            this._vendasdashService.INITIAL_FINAL_DATE,
            this._vendasdashService.INITIAL_COMPANIES_IDS,
            this._vendasdashService.INITIAL_SELLERS_IDS
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
    constructor(private _vendasdashService: VendasDashService) {}

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
        return this._vendasdashService.getSellersData(
            this._vendasdashService.INITIAL_INITIAL_DATE,
            this._vendasdashService.INITIAL_FINAL_DATE,
            this._vendasdashService.INITIAL_COMPANIES_IDS
        );
    }
}

@Injectable({
    providedIn: 'root',
})
export class CompaniesFilterResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _vendasdashService: VendasDashService) {}

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
        return this._vendasdashService.getFiliaisData();
    }
}
