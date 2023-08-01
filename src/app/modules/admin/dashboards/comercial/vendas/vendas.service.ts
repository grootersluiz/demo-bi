import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VendasDashService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _sellersData: BehaviorSubject<any> = new BehaviorSubject([]);

    //reports

    readonly REPORT_TKM = '261';
    readonly REPORT_ROL = '3';
    readonly CC_META_YEAR = '2023';
    readonly REPORT_FILTRO_FILIAIS = '101';
    readonly REPORT_FILTRO_VENDEDORES = '121';

    readonly INITIAL_INITIAL_DATE = this.getCurrentDate();
    readonly INITIAL_FINAL_DATE = this.getCurrentDate();

    readonly INITIAL_COMPANIES_IDS = ['null'];
    readonly INITIAL_SELLERS_IDS = ['null'];

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

    /**
     * Get data
     */
    getData(dtIni, dtFin, companiesIds, sellersIds): Observable<any> {
        let url = `http://10.2.1.108/v1/dashboards/data?reportId=${
            this.REPORT_TKM
        }&reportId=${this.REPORT_ROL}&reportId=${
            this.REPORT_FILTRO_FILIAIS
        }&dtini=
        ${this.formatDate(dtIni)}
        &codvend=${sellersIds.join(',')}&codemp=${companiesIds.join(',')}&dtfin=
        ${this.formatDate(dtFin)}`;

        return this._httpClient.get(url).pipe(
            tap((response: any) => {
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

                //----------------------------------------------

                //Tratamento Gráfico "TKM"

                response[this.REPORT_TKM].series.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_TKM].series[index] = 0;
                    }
                });

                const chartTKM = {
                    ...response[this.REPORT_TKM],
                    uniqueVisitors: response[this.REPORT_TKM].series['0'],
                };

                //---------------------------------------------------

                //---------------------------------------------------

                //Filtro Filiais

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
                    ccXMeta: ccMeta,
                    tkm: chartTKM,
                    filiaisLista: companyFilter,
                };
                this._data.next(dashData);
            })
        );
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
}
