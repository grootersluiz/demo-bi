import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'reggroups',
    templateUrl: './reggroups.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReggroupsComponent {
    /**
     * Constructor
     */
    constructor() {}
}
