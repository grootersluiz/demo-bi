import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RolService } from 'app/modules/admin/dashboards/rol/rol.service';

@Injectable({
    providedIn: 'root',
})
export class RolResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _rolService: RolService) { }

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
        return this._rolService.getData(
            this._rolService.INITIAL_INITIAL_DATE,
            this._rolService.INITIAL_FINAL_DATE,
            this._rolService.INITIAL_COMPANIES_IDS,
            this._rolService.INITIAL_SELLERS_IDS
        );
    }
}
