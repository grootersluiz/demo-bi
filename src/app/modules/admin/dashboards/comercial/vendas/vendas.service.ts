import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VendasDashService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    //reports

    readonly REPORT_TKM = '261';
    readonly REPORT_ROL = '3';
    readonly CC_META_YEAR = '2023';

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(dtIni, dtFin, companiesIds, sellersIds): Observable<any> {
        let url = `http://10.2.1.108/v1/dashboards/data?reportId=${
            this.REPORT_TKM
        }&reportId=${this.REPORT_ROL}&dtini=
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

                const dashData = {
                    ccXMeta: ccMeta,
                    tkm: chartTKM,
                };
                this._data.next(dashData);
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
