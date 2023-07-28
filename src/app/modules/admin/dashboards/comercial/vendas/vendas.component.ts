import { Component, ViewEncapsulation } from '@angular/core';
import { VendasDashService } from './vendas.service';

@Component({
    selector: 'globaldash',
    templateUrl: './vendas.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class VendasDashComponent {
    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
}
