import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { rol } from 'app/mock-api/dashboards/rol/data';

@Injectable({
    providedIn: 'root',
})
export class RolService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient
            .get('http://10.2.1.108/v1/dashboards/data?reportId=3&reportId=21')
            .pipe(
                tap((response: any) => {
                    const chartData = {
                        ...response['3']['2022'],
                        series: {
                            'this-year': response['3']['2022'].series,
                        },
                    };
                    const chartROLxMetas = {
                        ...response['21'],
                        uniqueVisitors: 100,
                    };

                    console.log('rol', chartData);
                    console.log('githubIssues', rol.githubIssues);
                    console.log('rol x metas - teste', chartROLxMetas);
                    console.log('rol x metas', rol.newVsReturning);
                    const dashData = {
                        ...rol,
                        githubIssues: chartData,
                        newVsReturning: chartROLxMetas,
                    };
                    this._data.next(dashData);
                })
            );
    }
}
