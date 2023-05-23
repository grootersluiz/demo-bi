import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { take } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanActivate {
    user: User;
    
    constructor(
        private router: Router,
        private _userService: UserService
    ) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    this._userService.user$
    .pipe(take(1))
    .subscribe((user: User) => {
        this.user = user;

    });

    const userType = this.user.role;
    
    return true;
    // if (userType === 'admin') {
    //   return true; 
    // } else {
    //   // User type is not allowed to access the route
    //   // Redirect the user to a different route or show an error message
    //   return this.router.parseUrl('/settings/profile'); // Redirect to the unauthorized page
    // }
  }
}