import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { VendafilialService } from 'app/modules/admin/dashboards/vendafilial/vendafilial.service';

@Injectable({
    providedIn: 'root',
})
export class VendafilialResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _vendafilialService: VendafilialService) {}

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
        return this._vendafilialService.getData();
    }
}
