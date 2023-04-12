import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RolService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _dataCCxMetas: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _httpClient1: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
        return this._dataCCxMetas.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/rol').pipe(
            tap((response: any) => {
                console.log('test', response);
                this._httpClient1
                    .get('http://10.2.1.108/v1/reports/3/data')
                    .pipe(
                        tap((response2: any) => {
                            console.log('ddddd', response2[4]);
                            const chartData = response2[4];

                            response['githubIssues'] = chartData;
                            this._data.next(response);
                        })
                    );
            })
        );
    }

    getDataCCxMetas(): Observable<any> {
        return this._httpClient1
            .get('http://10.2.1.108/v1/reports/3/data')
            .pipe(
                tap((response: any) => {
                    console.log('ddddd', response[4]);
                    const chartData = response[4];

                    this._dataCCxMetas.next(chartData);
                })
            );
    }
}
