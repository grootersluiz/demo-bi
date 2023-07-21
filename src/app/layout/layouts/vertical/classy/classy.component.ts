import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { Dash } from 'app/modules/admin/regdashs/regdashs.types';
import { RegdashsService } from 'app/modules/admin/regdashs/regdashs.service';
import { navigationData } from 'app/layout/layouts/vertical/classy/classy.data';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    dashList: Dash[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dashsIds: number[] = [];

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _regdashsService: RegdashsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        /*          this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });  */

        let myNavigation = JSON.parse(JSON.stringify(navigationData));
        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Controle de acesso do menu

                if (this.user.role !== 'admin') {
                    myNavigation.default[3] = {} as FuseNavigationItem;
                    myNavigation.default[4] = {} as FuseNavigationItem;
                }
            });

        //Controle de acesso - Dashboards
        this._regdashsService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dashList: Dash[]) => {
                this.dashList = dashList;

                // Controle de acesso do menu
                dashList.forEach((dash) => {
                    this.dashsIds.push(dash.id);
                });

                let dashsMenuList =
                    myNavigation.default[1].children[0].children; //alterado o default para 1 pois o vetor do mynavigation foi alterado para retirada do Links do Analise Indicadores.
                dashsMenuList.forEach((dashMenu, index) => {
                    if (!this.dashsIds.includes(parseInt(dashMenu.id))) {
                        dashsMenuList[index] = {};
                    }
                });

                let linksMenuList = myNavigation.default[0].children;
                linksMenuList.forEach((linkMenu, index) => {
                    if (!this.dashsIds.includes(parseInt(linkMenu.id))) {
                        linksMenuList[index] = {};
                    }
                });
            });

        this.navigation = myNavigation;

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
