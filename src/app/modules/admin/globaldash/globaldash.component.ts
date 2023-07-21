import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { RegdashsService } from '../regdashs/regdashs.service';

@Component({
    selector: 'globaldash',
    templateUrl: './globaldash.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class GlobalDashsComponent {
    dashsData: any[] = [];

    /**
     * Constructor
     */
    constructor(
        private _dashService: RegdashsService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._dashService.getDashs().subscribe((dashs) => {
            this.dashsData = (dashs as any).data;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    redirectDash(id: number): void {
        if (id === 41) {
            this._router.navigate(['/dashboards/rol']);
        } else if (id === 42) {
            this._router.navigate(['/dashboards/vendafilial']);
        } else if (id === 181) {
            this._router.navigate(['/dashboards/analisemarca']);
        } else if (id === 43) {
            this._router.navigate(['/links/linksGeral']);
        } else if (id === 44) {
            this._router.navigate(['/links/linksTI']);
        } else this._router.navigate(['/settings/profile']);
    }
}
