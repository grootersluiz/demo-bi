import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'regviews',
    templateUrl: './regviews.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegviewsComponent {
    /**
     * Constructor
     */
    constructor() {}
}
