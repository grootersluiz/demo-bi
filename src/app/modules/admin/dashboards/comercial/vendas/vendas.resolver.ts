import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return;
    }
}
