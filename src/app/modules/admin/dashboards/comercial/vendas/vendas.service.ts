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
    readonly REPORT_COMPANUAL = '359';
    readonly REPORT_CCPROJECAO = '360';
    readonly REPORT_LBvsCC = '361';
    readonly REPORT_MBvsCC = '362';
    readonly REPORT_COBERTURA = '363';
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
        }&reportId=${this.REPORT_FILTRO_FILIAIS}&dtini=
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

                //Tratamento Gráfico "CC"

                let totalCC = response[this.REPORT_CC].TOTALCC;
                let ccRealDC = response[this.REPORT_CC].CCREALIZADODC;
                let ccRealFC = response[this.REPORT_CC].CCREALIZADOFC;
                let totalCCReal = response[this.REPORT_CC].TOTALCCREALIZADO;
                let meta = response[this.REPORT_CC].META;
                let gap = response[this.REPORT_CC].GAP;

                let indCC = [
                    totalCC,
                    ccRealDC,
                    ccRealFC,
                    totalCCReal,
                    meta,
                    gap,
                ];

                indCC.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_CC][index] = 0;
                    }
                });

                const chartCC = response[this.REPORT_CC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "CC vs ROL"

                let rol = response[this.REPORT_CCvsROL].ROL;
                let rolDC = response[this.REPORT_CCvsROL].ROLDC;
                let rolFC = response[this.REPORT_CCvsROL].ROLFC;
                let metaRol = response[this.REPORT_CCvsROL].META;
                let gapRol = response[this.REPORT_CCvsROL].GAP;

                let indCCvsROL = [rol, rolDC, rolFC, metaRol, gapRol];

                indCCvsROL.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_CCvsROL][index] = 0;
                    }
                });

                const chartCCvsROL = response[this.REPORT_CCvsROL];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "Comparativo Anual"

                // indCCvsROL.forEach((element, index) => {
                //     if (element == null) {
                //         response[this.REPORT_CCvsROL][index] = 0;
                //     }
                // });

                const chartCompAnual = response[this.REPORT_COMPANUAL];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "CC Projeção"

                let potencial = response[this.REPORT_CCPROJECAO].POTENCIAL;
                let proj = response[this.REPORT_CCPROJECAO].PROJ;
                let gapProj = response[this.REPORT_CCPROJECAO].GAP;
                let projPF = response[this.REPORT_CCPROJECAO].PROJPF;
                let projPJ = response[this.REPORT_CCPROJECAO].PROJPJ;

                let indCCProjecao = [potencial, proj, gapProj, projPF, projPJ];

                indCCProjecao.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_CCPROJECAO][index] = 0;
                    }
                });

                const chartCCprojecao = response[this.REPORT_CCPROJECAO];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "LB vs CC"

                let lb = response[this.REPORT_LBvsCC].LB;
                let lbdc = response[this.REPORT_LBvsCC].LBDC;
                let lbfc = response[this.REPORT_LBvsCC].LBFC;
                let metaLB = response[this.REPORT_LBvsCC].META;
                let gapLB = response[this.REPORT_LBvsCC].GAP;

                let indCCvsLB = [lb, lbdc, lbfc, metaLB, gapLB];

                indCCvsLB.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_LBvsCC][index] = 0;
                    }
                });

                const chartLBvsCC = response[this.REPORT_LBvsCC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "MB vs CC"

                let mb = response[this.REPORT_MBvsCC].MB;
                let mbdc = response[this.REPORT_MBvsCC].MBDC;
                let mbfc = response[this.REPORT_MBvsCC].MBFC;
                let metaMB = response[this.REPORT_MBvsCC].META;
                let gapMB = response[this.REPORT_MBvsCC].GAP;

                let indCCvsMB = [mb, mbdc, mbfc, metaMB, gapMB];

                indCCvsMB.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_MBvsCC][index] = 0;
                    }
                });

                const chartMBvsCC = response[this.REPORT_MBvsCC];

                //---------------------------------------------------

                //----------------------------------------------

                //Tratamento Gráfico "Cobertura"

                let cob = response[this.REPORT_COBERTURA].COB;
                let cobpj = response[this.REPORT_COBERTURA].COBPJ;
                let cobpf = response[this.REPORT_COBERTURA].COBPF;

                let indCobertura = [cob, cobpj, cobpf];

                indCobertura.forEach((element, index) => {
                    if (element == null) {
                        response[this.REPORT_COBERTURA][index] = 0;
                    }
                });

                const chartCobertura = response[this.REPORT_COBERTURA];

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
