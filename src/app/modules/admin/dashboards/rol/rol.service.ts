import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { rol } from 'app/mock-api/dashboards/rol/data';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class RolService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _sellersData: BehaviorSubject<any> = new BehaviorSubject([]);

    readonly REPORT_ROL = '3';
    readonly REPORT_ROL_VS_META = '21';
    readonly REPORT_ROL_VS_ROL_REALIZADA = '41';
    readonly REPORT_INDICADORES_ROL = '42';
    readonly REPORT_METAS_ATINGIDAS = '81';
    readonly REPORT_DIAS_UTEIS = '82';
    readonly REPORT_RANKING_ROL = '83';
    readonly REPORT_RANKING_METAS = '84';
    readonly REPORT_FILTRO_FILIAIS = '101';
    readonly REPORT_FILTRO_VENDEDORES = '121';
    readonly CC_META_YEAR = '2023';

    readonly INITIAL_INITIAL_DATE = this.getCurrentDate();
    readonly INITIAL_FINAL_DATE = this.getCurrentDate();

    readonly INITIAL_COMPANIES_IDS = ['null'];
    readonly INITIAL_SELLERS_IDS = ['null'];

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

    get sellersData$(): Observable<any> {
        return this._sellersData.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    updateObject(obj) {
        // Get the first and last dates in the data
        const firstDate = new Date(obj.series[0].data[0].x);
        const lastDate = new Date(
            obj.series[0].data[obj.series[0].data.length - 1].x
        );

        // Calculate the new dates
        const newFirstDate = new Date(firstDate.getTime());
        newFirstDate.setMonth(firstDate.getMonth() - 1);
        const newLastDate = new Date(lastDate.getTime());
        newLastDate.setMonth(lastDate.getMonth() + 1);

        // Create the new data points
        const newFirstPoint = {
            x: newFirstDate.toISOString(),
            y: 0,
        };
        const newLastPoint = { x: newLastDate.toISOString(), y: 0 };

        // Add the new points to each series
        for (const series of obj.series) {
            series.data.unshift(newFirstPoint);
            series.data.push(newLastPoint);
        }

        return obj;
    }

    getCurrentDate() {
        let date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        };
    }

    formatDate(date) {
        const day = date.date.toString();
        const month = (date.month + 1).toString();
        const year = date.year.toString();
        return `${day}/${month}/${year}`;
    }

    getSellersData(dtIni, dtFin, companiesIds) {
        let url = `http://10.2.1.108/v1/dashboards/data?&reportId=121&dtini=${this.formatDate(
            dtIni
        )}&codvend=null&codemp=${companiesIds.join(
            ','
        )}&dtfin=${this.formatDate(dtFin)}`;

        return this._httpClient.get(url).pipe(
            tap((response: any) => {
                const sellersFilter = response[this.REPORT_FILTRO_VENDEDORES][
                    'rows'
                ].map((item) => {
                    return {
                        id: item[0],
                        string: item[0].toString() + ' - ' + item[1],
                    };
                });

                this._sellersData.next(sellersFilter);
            })
        );
    }
    /**
     * Get data
     */
    getData(dtIni, dtFin, companiesIds, sellersIds): Observable<any> {
        let url = `http://10.2.1.108/v1/dashboards/data?reportId=${
            this.REPORT_ROL
        }&reportId=${this.REPORT_ROL_VS_META}&reportId=${
            this.REPORT_ROL_VS_ROL_REALIZADA
        }&reportId=${this.REPORT_INDICADORES_ROL}&reportId=${
            this.REPORT_METAS_ATINGIDAS
        }&reportId=${this.REPORT_DIAS_UTEIS}&reportId=${
            this.REPORT_RANKING_ROL
        }&reportId=${this.REPORT_RANKING_METAS}&reportId=${
            this.REPORT_FILTRO_FILIAIS
        }&dtini=
        ${this.formatDate(dtIni)}
        &codvend=${sellersIds.join(',')}&codemp=${companiesIds.join(',')}&dtfin=
        ${this.formatDate(dtFin)}`;

        return this._httpClient.get(url).pipe(
            tap((response: any) => {
                // Aplica função que zera o grafico nos extremos
                if (
                    response[this.REPORT_ROL_VS_ROL_REALIZADA].series[0].data[0]
                ) {
                    this.updateObject(
                        response[this.REPORT_ROL_VS_ROL_REALIZADA]
                    );
                }

                //Tratamento do Gráfico Meta ROL x ROL Realizada

                response[this.REPORT_ROL_VS_ROL_REALIZADA].series.forEach(
                    (element, index) => {
                        if (element.data.y == null) {
                            response[this.REPORT_ROL_VS_ROL_REALIZADA].series[
                                index
                            ].data.y = 0;
                        }
                    }
                );

                const rolVsRolRealizada =
                    response[this.REPORT_ROL_VS_ROL_REALIZADA];

                //----------------------------------------------------------------

                // Tratamento do Gráfico "Indicadores ROL"

                let maxRol = response[this.REPORT_INDICADORES_ROL].LIMITE;
                let minRol = response[this.REPORT_INDICADORES_ROL].SPENT;
                let avgRol = response[this.REPORT_INDICADORES_ROL].MINIMUM;

                let indRol = [maxRol, minRol, avgRol];

                indRol.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_INDICADORES_ROL][index] = 0;
                    }
                });

                const indicadoresRol = response[this.REPORT_INDICADORES_ROL];

                //----------------------------------------------------------------

                // Tratamento do CC Meta
                let ccMeta = {
                    labels: [],
                    series: {
                        'this-year': [],
                    },
                };
                try {
                    ccMeta.labels = response[this.REPORT_ROL][this.CC_META_YEAR]
                        ? response[this.REPORT_ROL][this.CC_META_YEAR].labels
                        : [];
                    ccMeta.series = {
                        'this-year': response[this.REPORT_ROL][
                            this.CC_META_YEAR
                        ]
                            ? response[this.REPORT_ROL][this.CC_META_YEAR]
                                  .series
                            : [],
                    };
                } catch {
                    ccMeta = {
                        labels: [],
                        series: {
                            'this-year': [],
                        },
                    };
                }
                //--------------------------------------------------

                // Tratamento do grafico Rol x Meta
                response[this.REPORT_ROL_VS_META].series.forEach(
                    (element, index) => {
                        if (element == null) {
                            response[this.REPORT_ROL_VS_META].series[index] = 0;
                        }
                    }
                );

                const META = 0;
                const ROL = 1;
                const GAP = 2;

                response[this.REPORT_ROL_VS_META].series[GAP] *= -1;

                const chartROLxMetas = {
                    ...response[this.REPORT_ROL_VS_META],
                    uniqueVisitors:
                        response[this.REPORT_ROL_VS_META].series[META],
                };

                chartROLxMetas.series.push(50000000);
                chartROLxMetas.labels.push('PROJEÇÃO');

                //----------------------------------------------

                //Tratamento Gráfico "Metas Atingidas"

                response[this.REPORT_METAS_ATINGIDAS].series.forEach(
                    (element, index) => {
                        if (element == null) {
                            response[this.REPORT_METAS_ATINGIDAS].series[
                                index
                            ] = 0;
                        }
                    }
                );

                const chartMetasAtingidas = {
                    ...response[this.REPORT_METAS_ATINGIDAS],
                    uniqueVisitors:
                        response[this.REPORT_METAS_ATINGIDAS].series['0'],
                };

                //---------------------------------------------------

                //Tratamento do Gráfico "Dias Úteis"

                response[this.REPORT_DIAS_UTEIS].series.forEach(
                    (element, index) => {
                        if (element == null) {
                            response[this.REPORT_DIAS_UTEIS].series[index] = 0;
                        }
                    }
                );

                response[this.REPORT_DIAS_UTEIS].labels.pop();
                response[this.REPORT_DIAS_UTEIS].labels.push('Dias Úteis');

                const chartDiasUteis = {
                    ...response[this.REPORT_DIAS_UTEIS],
                    uniqueVisitors: 30,
                };

                //---------------------------------------------------

                const tableRankingRol = response[this.REPORT_RANKING_ROL];
                const tableRankingMetas = response[this.REPORT_RANKING_METAS];

                const COD_EMPRESA = 0;
                const RAZAO_ABREV = 1;

                const companyFilter = response[this.REPORT_FILTRO_FILIAIS][
                    'rows'
                ].map((item) => {
                    return {
                        id: item[COD_EMPRESA],
                        string:
                            item[COD_EMPRESA].toString() +
                            ' - ' +
                            item[RAZAO_ABREV],
                    };
                });

                const dashData = {
                    // ...rol,
                    githubIssues: ccMeta,
                    newVsReturning: chartROLxMetas,
                    visitorsVsPageViews: rolVsRolRealizada,
                    previousStatement: indicadoresRol,
                    gender: chartMetasAtingidas,
                    age: chartDiasUteis,
                    recentTransactions: tableRankingRol,
                    recentTransactions2: tableRankingMetas,
                    filiaisLista: companyFilter,
                };
                this._data.next(dashData);
            })
        );
    }
}
