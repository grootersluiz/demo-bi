import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DreDashService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _sellersData: BehaviorSubject<any> = new BehaviorSubject([]);

    //reports

    readonly REPORT_FILTRO_FILIAIS = '101';
    readonly REPORT_FILTRO_VENDEDORES = '121';
    readonly REPORT_COMPANUAL = '359';
    readonly REPORT_ROL_LB_MB_EBITDA = '401';
    readonly REPORT_ROL_VS_DESPESAS = '402';

    // readonly INITIAL_INITIAL_DATE = { year: 2023, month: 0, date: 1 };
    // readonly INITIAL_FINAL_DATE = { year: 2023, month: 1, date: 1 };
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
            this.REPORT_FILTRO_FILIAIS
        }&reportId=${
            this.REPORT_COMPANUAL
        }&reportId=${
            this.REPORT_ROL_LB_MB_EBITDA
        }&reportId=${
            this.REPORT_ROL_VS_DESPESAS
        }&dtini=
        ${this.formatDate(dtIni)}
        &codvend=${sellersIds.join(',')}&codemp=${companiesIds.join(',')}&dtfin=
        ${this.formatDate(dtFin)}`;

        return this._httpClient.get(url).pipe(
            tap((response: any) => {
                //---------------------------------------------------

                // Filtro Filiais

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

                //----------------------------------------------
                
                //----------------------------------------------

                // Tratamento Gráfico "Comparativo Anual"

                const chartCompAnual = response[this.REPORT_COMPANUAL];
               

                // Reversão Chart "Comparativo Anual"
                // Object.keys(chartCompAnual).forEach((key) => {
                //     if (key != 'report') {
                //         chartCompAnual[key].labels.reverse();
                //         chartCompAnual[key].series.forEach((serie) => {
                //             serie.data.reverse();
                //         });
                //     }
                // });
                
                //---------------------------------------------------

                //----------------------------------------------

                // Tratamento Gráfico "ROL - LB - MB - EBITDA"

                const chartRolLbMbEbitda = response[this.REPORT_ROL_LB_MB_EBITDA];

                Object.keys(chartRolLbMbEbitda).forEach((key) => {
                    if (key != 'report') {
                        chartRolLbMbEbitda[key].series.unshift({
                            name: 'ROL',
                            data: [parseFloat(chartRolLbMbEbitda[key].labels[0])],
                            type: 'column',
                        });
                    }
                });

                //---------------------------------------------------

                //----------------------------------------------

                // Tratamento Gráfico "ROL VS DESPESAS"

                const chartRolVsDespesas = response[this.REPORT_ROL_VS_DESPESAS];

                Object.keys(chartRolVsDespesas).forEach((key) => {
                    if (key != 'report') {
                        chartRolVsDespesas[key].series.unshift({
                            name: 'ROL',
                            data: [parseFloat(chartRolVsDespesas[key].labels[0])],
                            type: 'column',
                        });
                    }
                });


                //---------------------------------------------------

                //---------------------------------------------------

                const dashData = {
                    filiaisLista: companyFilter,
                    ccCompAnual: chartCompAnual,
                    ccRolLbMbEbitda: chartRolLbMbEbitda,
                    ccRolVsDespesas: chartRolVsDespesas,
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
