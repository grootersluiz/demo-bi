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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalDashsComponent {
    /**
     * Constructor
     */
    constructor(private _dashService: RegdashsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._dashService.getDashs().subscribe((dashs) => {
            console.log(dashs['data']);
        });
    }
}
