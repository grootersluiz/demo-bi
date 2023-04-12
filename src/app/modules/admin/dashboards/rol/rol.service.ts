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
        return this._httpClient.get('http://10.2.1.108/v1/reports/3/data').pipe(
            tap((response: any) => {
                const chartData = {
                    ...response[4],
                    series: {
                        'this-year': response[4].series.map((item) => ({
                            ...item,
                            data: item.values,
                        })),
                    },
                };

                console.log('rol', chartData);
                console.log('githubIssues', rol.githubIssues);
                const dashData = { ...rol, githubIssues: chartData };
                this._data.next(dashData);
            })
        );
    }
}
