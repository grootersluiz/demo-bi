import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { User } from 'app/core/user/user.types';
import { Dash } from 'app/modules/admin/regdashs/regdashs.types';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class dashEstoqueGuard implements CanActivate {
    user: User;
    dash: Dash;
    dashList: Dash[];
    dashsIds: number[] = [];
    accessValidator: boolean;

    constructor(
        private router: Router,
        private _userService: UserService,
        private _dashService: RegdashsService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {
        this._dashService.contacts$
            .pipe(take(1))
            .subscribe((dashList: Dash[]) => {
                this.dashList = dashList;

                // Controle de acesso do menu
                dashList.forEach((dash) => {
                    this.dashsIds.push(dash.id);
                });

                if (this.dashsIds.includes(251)) {
                    this.accessValidator = true;
                }
            });

        if (!this.dashsIds.includes(251)) {
            // User type is not allowed to access the route
            // Redirect the user to a different route or show an error message
            this.accessValidator = false;
            return this.router.parseUrl('/settings/profile'); // Redirect to the unauthorized page
        }
        return this.accessValidator;
    }
}
