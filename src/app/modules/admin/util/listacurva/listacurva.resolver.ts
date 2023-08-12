import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ListacurvaService } from './listacurva.service';

@Injectable({
  providedIn: 'root'
})
export class ListacurvaResolver implements Resolve<boolean> {

    constructor(private _listacurvaService: ListacurvaService) { }

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
        return this._listacurvaService.getData();
    }


}
