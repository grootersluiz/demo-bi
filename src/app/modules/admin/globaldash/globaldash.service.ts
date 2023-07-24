import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Reports } from 'app/modules/admin/regreports/regreports.types';

@Injectable({
    providedIn: 'root',
})
export class GlobalDashService {
    constructor(private _httpClient: HttpClient) {}

    private _reports: BehaviorSubject<Reports[] | null> = new BehaviorSubject(
        null
    );

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Reports Data
     */
    getReportData(id: string): Observable<Reports[]> {
        return this._httpClient
            .get<Reports[]>(`http://10.2.1.108/v1/reports/${id}/data`)
            .pipe(
                tap((data) => {
                    this._reports.next(data);
                })
            );
    }
}
