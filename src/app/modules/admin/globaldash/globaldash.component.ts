import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

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
    constructor(private _dashService: RegdashsService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._dashService.getDashs().subscribe((dashs) => {
            this.dashsData = (dashs as any).data;
            console.log(this.dashsData)
        });
    }
}
