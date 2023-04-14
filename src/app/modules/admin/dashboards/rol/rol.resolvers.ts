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
            { year: 2022, month: 10, date: 10 },
            { year: 2023, month: 1, date: 10 }
        );
    }
}
