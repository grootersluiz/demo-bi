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
            .get(
                'http://10.2.1.108/v1/dashboards/data?reportId=3&reportId=21&reportId=41&reportId=42'
            )
            .pipe(
                tap((response: any) => {
                    const keyRolVsRolRealizada = 'visitorsVsPageViews';
                    const keyApiRolVsRolRealizada = '41';
                    console.log(
                        'RolVsRolRealizada',
                        rol[keyRolVsRolRealizada],
                        response[keyApiRolVsRolRealizada]
                    );

                    const keyIndicadoresRol = 'previousStatement';
                    const keyApiIndicadoresRol = '42';
                    console.log(
                        'IndicadoresRol',
                        rol[keyIndicadoresRol],
                        response[keyApiIndicadoresRol]
                    );

                    const ccMeta = response['3']['2023'];
                    const chartData = {
                        ...ccMeta,
                        series: {
                            'this-year': ccMeta.series,
                        },
                    };
                    let gap =
                        response['21'].series['0'] - response['21'].series['1'];
                    response['21'].series.push(gap);
                    response['21'].labels.push('GAP');

                    const chartROLxMetas = {
                        ...response['21'],
                        uniqueVisitors: response['21'].series['0'],
                    };

                    console.log('rol', chartData);
                    console.log('githubIssues', rol.githubIssues);
                    console.log('rol x metas - teste', chartROLxMetas);
                    console.log('rol x metas', rol.newVsReturning);
                    const dashData = {
                        ...rol,
                        githubIssues: chartData,
                        newVsReturning: chartROLxMetas,
                        [keyRolVsRolRealizada]:
                            response[keyApiRolVsRolRealizada],
                        [keyIndicadoresRol]: response[keyApiIndicadoresRol],
                    };
                    this._data.next(dashData);
                })
            );
    }
}
