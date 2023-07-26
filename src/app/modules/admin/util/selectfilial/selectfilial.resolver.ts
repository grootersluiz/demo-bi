import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SelectfilialService } from './selectfilial.service';

@Injectable({
  providedIn: 'root'
})
export class SelectfilialResolver implements Resolve<boolean> {

    constructor(private _selectfilialService: SelectfilialService) { }

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
        return this._selectfilialService.getData();
    }


}
