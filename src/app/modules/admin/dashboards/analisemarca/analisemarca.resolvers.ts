import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AnalisemarcaService } from 'app/modules/admin/dashboards/analisemarca/analisemarca.service';

@Injectable({
    providedIn: 'root',
})
export class AnalisemarcaResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _vendafilialService: AnalisemarcaService) {}

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
