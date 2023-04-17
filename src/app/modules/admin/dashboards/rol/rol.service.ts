import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { rol } from 'app/mock-api/dashboards/rol/data';
import { DatePipe } from '@angular/common';

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

    // formatDateUSFormat(data) {
    //     const date = new Date(data);
    //     const day = date.getDate().toString().padStart(2, '0');
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const year = date.getFullYear().toString();

    //     return `${day}/${month}/${year}`;
    // }

    /**
     * Get data
     */
    getData(dtIni, dtFin): Observable<any> {
        // const datepipe = new DatePipe('pt-BR');
        // let formattedDate = datepipe.transform(dtIni, 'dd/MM/YYYY');

        // const datepipe2 = new DatePipe('pt-BR');
        // let formattedDate2 = datepipe2.transform(dtFin, 'dd/MM/YYYY');
        // this.formatDateUSFormat(dtIni);
        // this.formatDateUSFormat(dtFin);
        // console.log('teste data', formattedDate);
        // console.log('teste data', formattedDate2);

        // console.log('teste func', dtIni);

        function formatDate(date) {
            const day = date.date.toString();
            const month = (date.month + 1).toString();
            const year = date.year.toString();
            return `${day}/${month}/${year}`;
        }

        console.log(formatDate(dtIni));
        console.log(formatDate(dtFin));

        return this._httpClient
            .get(
                `http://10.2.1.108/v1/dashboards/data?reportId=3&reportId=21&reportId=41&reportId=42&reportId=81&reportId=82&reportId=83&reportId=84&reportId=101&reportId=121&dtini=
                ${formatDate(dtIni)}
                &codvend=null&codemp=2&dtfin=
                ${formatDate(dtFin)}`
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
                    // let gap =
                    //     response['21'].series['0'] - response['21'].series['1'];
                    // response['21'].series.push(gap);
                    // response['21'].labels.push('GAP');

                    response['21'].series['2'] =
                        response['21'].series['2'] * -1;

                    const chartROLxMetas = {
                        ...response['21'],
                        uniqueVisitors: response['21'].series['1'],
                    };

                    const chartMetasAtingidas = {
                        ...response['81'],
                        uniqueVisitors: response['81'].series['0'],
                    };

                    response['82'].labels.pop();
                    response['82'].labels.push('Dias Úteis');

                    const chartDiasUteis = {
                        ...response['82'],
                        uniqueVisitors: 30,
                    };

                    const tableRankingRol = response['83'];
                    const tableRankingMetas = response['84'];

                    const companyFilter = response['101']['rows'].map(
                        (item) => {return {id: item[0], string: item[1] + ' - ' + item[0].toString()}}
                    );

                    const sellersFilter = response['121']['rows'].map(
                        (item) => {return {id: item[0], string: item[1] + ' - ' + item[0].toString()}}
                    );

                    console.log('teste filiais', companyFilter);
                    console.log('teste vendedores', sellersFilter);
                    console.log('ranking ROL', tableRankingRol);
                    console.log('Ranking ROL', rol.recentTransactions);
                    console.log('dias uteis teste', chartDiasUteis);
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
                        gender: chartMetasAtingidas,
                        age: chartDiasUteis,
                        recentTransactions: tableRankingRol,
                        recentTransactions2: tableRankingMetas,
                        filiaisLista: companyFilter,
                        vendedoresLista: sellersFilter,

                    };
                    this._data.next(dashData);
                })
            );
    }
}
