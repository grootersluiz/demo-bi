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
    constructor(private _rolService: RolService) {}

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
            new Date(2022, 0, 1),
            new Date(2022, 11, 31)
        );
    }
}
