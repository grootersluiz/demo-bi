import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RegdashsService } from '../regdashs/regdashs.service';
import { Dash } from '../regdashs/regdashs.types';
import { GlobalDashService } from './globaldash.service';

@Component({
    selector: 'globaldash',
    templateUrl: './globaldash.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class GlobalDashsComponent {
    dashsData: any[] = [];
    dashReps: any[];
    reportObj: {
        id: number;
        link: string;
    }[] = [];

    /**
     * Constructor
     */
    constructor(
        private _dashService: RegdashsService,
        private _dashIdService: RegdashsService,
        private _globalDashService: GlobalDashService,
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

        this._dashIdService.getDbById(241).subscribe((links) => {
            this.dashReps = links['reportIds'];

            this.dashReps.forEach((id) =>
                this._globalDashService.getReportsData(id).subscribe((data) => {
                    this.reportObj.push({
                        id,
                        link: data['link'],
                    });
                })
            );
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    redirectLink(link: string) {
        window.open(link);
    }

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
        } else if (id === 241) {
            this._router.navigate(['linkstest']);
        } else this._router.navigate(['/settings/profile']);
    }
}
