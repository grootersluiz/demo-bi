import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RegdashsService } from '../regdashs/regdashs.service';
import { GlobalDashService } from './globaldash.service';

@Component({
    selector: 'globaldash',
    templateUrl: './globaldash.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./globaldash.component.scss'],
})
export class GlobalDashsComponent {
    margin =
        'content-center grid gap-x-15 gap-y-15 grid-col-1 md:grid-cols-2 lg:md:grid-cols-2 xl:md:grid-cols-2 xl2:md:grid-cols-2 grid-rows-3 mx-10 md:mx-36 lg:mx-36 xl:mx-36 xl2:mx-36 my-20';
    dashsData: any[] = [];
    dashReps: any[];
    reportObj: {
        id: number;
        name: string;
        data: string;
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
                        id: data['report']['id'],
                        name: data['report']['name'],
                        data: data['data'],
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
}
