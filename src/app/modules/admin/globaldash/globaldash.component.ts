import { Component, ViewEncapsulation } from '@angular/core';
import { RegdashsService } from '../regdashs/regdashs.service';
import { GlobalDashService } from './globaldash.service';
import { ReportObject } from './globaldash.types';

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
    reportObj: ReportObject[] = [];

    /**
     * Constructor
     */
    constructor(
        private _dashIdService: RegdashsService,
        private _globalDashService: GlobalDashService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._dashIdService.getDashboardById(241).subscribe((links) => {
            this.dashReps = links['reportIds'];

            this.dashReps.forEach((id) =>
                this._globalDashService.getReportData(id).subscribe((data) => {
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
