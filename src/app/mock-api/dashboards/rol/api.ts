import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { rol as rolData } from 'app/mock-api/dashboards/rol/data';

@Injectable({
    providedIn: 'root',
})
export class RolMockApi {
    private _rol: any = rolData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Sales - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/rol')
            .reply(() => [200, cloneDeep(this._rol)]);
    }
}
