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

    readonly REPORT_CC = '357';
    readonly REPORT_CCvsROL = '358';
    readonly REPORT_COMPANUAL = '381';
    readonly REPORT_CCPROJECAO = '360';
    readonly REPORT_LBvsCC = '361';
    readonly REPORT_MBvsCC = '362';
    readonly REPORT_COBERTURA = '363';
    readonly REPORT_INDICADORES = '364';
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
            this.REPORT_CC
        }&reportId=${this.REPORT_CCvsROL}&reportId=${
            this.REPORT_COMPANUAL
        }&reportId=${this.REPORT_CCPROJECAO}&reportId=${
            this.REPORT_LBvsCC
        }&reportId=${this.REPORT_MBvsCC}&reportId=${
            this.REPORT_COBERTURA
        }&reportId=${this.REPORT_INDICADORES}&reportId=${
            this.REPORT_FILTRO_FILIAIS
        }&dtini=
        ${this.formatDate(dtIni)}
        &codvend=${sellersIds.join(',')}&codemp=${companiesIds.join(',')}&dtfin=
        ${this.formatDate(dtFin)}`;

        return this._httpClient.get(url).pipe(
            tap((response: any) => {
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

                //----------------------------------------------

                //Tratamento Gráfico "Análise Positivação das Carteiras"

                Object.keys(response[this.REPORT_CC]).forEach((key) => {
                    response[this.REPORT_CC][key] =
                        response[this.REPORT_CC][key] ?? 0;
                });

                const chartCC = response[this.REPORT_CC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "ROL Carteira"

                Object.keys(response[this.REPORT_CCvsROL]).forEach((key) => {
                    response[this.REPORT_CCvsROL][key] =
                        response[this.REPORT_CCvsROL][key] ?? 0;
                });

                const chartCCvsROL = response[this.REPORT_CCvsROL];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "Comparativo Anual"

                const chartCompAnual = response[this.REPORT_COMPANUAL];

                // Reversão Chart "Comparativo Anual"
                Object.keys(chartCompAnual).forEach((key) => {
                    if (key != 'report') {
                        chartCompAnual[key].labels.reverse();
                        chartCompAnual[key].series.forEach((serie) => {
                            serie.data.reverse();
                        });
                    }
                });

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "CC Projeção"

                Object.keys(response[this.REPORT_CCPROJECAO]).forEach((key) => {
                    response[this.REPORT_CCPROJECAO][key] =
                        response[this.REPORT_CCPROJECAO][key] ?? 0;
                });

                const chartCCprojecao = response[this.REPORT_CCPROJECAO];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "LB vs CC"

                Object.keys(response[this.REPORT_LBvsCC]).forEach((key) => {
                    response[this.REPORT_LBvsCC][key] =
                        response[this.REPORT_LBvsCC][key] ?? 0;
                });

                const chartLBvsCC = response[this.REPORT_LBvsCC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "MB vs CC"

                Object.keys(response[this.REPORT_MBvsCC]).forEach((key) => {
                    response[this.REPORT_MBvsCC][key] =
                        response[this.REPORT_MBvsCC][key] ?? 0;
                });

                const chartMBvsCC = response[this.REPORT_MBvsCC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "Cobertura"

                Object.keys(response[this.REPORT_COBERTURA]).forEach((key) => {
                    response[this.REPORT_COBERTURA][key] =
                        response[this.REPORT_COBERTURA][key] ?? 0;
                });

                const chartCobertura = response[this.REPORT_COBERTURA];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "Indicadores Mensais (CC)"

                //Ajustanto vetor de indicadores

                const tempIndicadores = response[this.REPORT_INDICADORES];

                Object.keys(tempIndicadores).forEach((key) => {
                    if (key != 'report') {
                        tempIndicadores[key].series.unshift({
                            name: 'VLRROL_DC',
                            data: tempIndicadores[key].labels,
                            type: 'column',
                        });
                    }
                });

                // Formatando e Ordenando Datas

                const chartIndicadores = [];
                Object.keys(tempIndicadores).forEach((key) => {
                    if (key != 'report') {
                        // Create a Date object from the input date string
                        const inputDate = new Date(key);

                        // Get the UTC components of the date
                        const year = inputDate.getUTCFullYear();
                        const month = inputDate.getUTCMonth() + 1;
                        const day = inputDate.getUTCDate();

                        // Convert components to strings and add leading zeros if necessary
                        const formattedMonth = String(month).padStart(2, '0');
                        const formattedDay = String(day).padStart(2, '0');

                        // Create the final formatted date string
                        const formattedDateString = `${formattedMonth}/${formattedDay}/${year}`;

                        chartIndicadores.push({
                            [formattedDateString]: tempIndicadores[key],
                        });
                    }
                });

                //Preparando vetor de labels

                const chartIndLabels = chartIndicadores.map((item) => {
                    return Object.keys(item)[0];
                });

                //Preparando vetor de series

                // const chartIndSeries = chartIndicadores.map((item) => {

                //---------------------------------------------------

                //---------------------------------------------------

                const dashData = {
                    filiaisLista: companyFilter,
                    cc: chartCC,
                    ccVsRol: chartCCvsROL,
                    ccProj: chartCCprojecao,
                    ccLB: chartLBvsCC,
                    ccMB: chartMBvsCC,
                    ccCob: chartCobertura,
                    ccCompAnual: chartCompAnual,
                    ccInd: chartIndicadores,
                    ccIndLabels: chartIndLabels,
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
