import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'regdashs',
    templateUrl: './regdashs.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegdashsComponent {
    /**
     * Constructor
     */
    constructor() {}
}
