import { Injectable } from '@angular/core';
import { tipovendaComponent } from './tipovenda.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class tipovendaService {
    readonly INITIAL_INITIAL_DATE = this.getCurrentDate();
    readonly INITIAL_FINAL_DATE = this.getCurrentDate();
    series = { columns: [], rows: [] };
    sysdate = new Date();
    param = {
        mes: null,
        ano: null,
        dtIni: '',
        dtFin: '',
        filial: 99,
        descFilial: 'REDE',
        marca: 'null',
    };

    seriesPie = [];

    formatDateIni(date) {
        if (date === '' || date === null ||date === undefined) {
            const day = '1';
            const month = '1';
            const year = this.sysdate.getFullYear().toString();
            this.param.dtIni = `${day}/${month}/${year}`;
            return `${day}/${month}/${year}`;
        } else if(date.date != null){
            const day = date.date.toString();
            const month = (date.month + 1).toString();
            const year = date.year.toString();

            return `${day}/${month}/${year}`;
        }
        return date;

    }
    formatDateFin(date) {
        if (date === '' || date === null ||date === undefined) {
            const day = this.sysdate.getDate().toString();
            const month = (this.sysdate.getMonth()+1).toString();
            const year = this.sysdate.getFullYear().toString();
            this.param.dtFin = `${day}/${month}/${year}`;
            return `${day}/${month}/${year}`;
        } else if(date.date != null){
            const day = date.date.toString();
            const month = (date.month + 1).toString();
            const year = date.year.toString();
            return `${day}/${month}/${year}`;
        }
        return date;
    }

    getCurrentDate() {
        let date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        };
    }

    setParam(dtini, dtfin, filial, descFilial) {
        this.param.dtIni = dtini;
        this.param.dtFin = dtfin;
        this.param.filial = filial;
        this.param.descFilial = descFilial;
    }

    getSeriesPie(): Observable<any> {
        var filiais = this.param.filial;
        var dtIni = this.param.dtIni;
        var dtFin = this.param.dtFin;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/514/data?' +
            'filiais=' +
            filiais +
            '&dtIni=' +
            this.formatDateIni(dtIni) +
            '&dtFin=' +
            this.formatDateFin(dtFin)
        );
    }
    getSeriesM1(): Observable<any> {
        var filiais = this.param.filial;
        var dtIni = this.param.dtIni;
        var dtFin = this.param.dtFin;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/515/data?' +
            'filiais=' +
            filiais +
            '&dtIni=' +
            this.formatDateIni(dtIni) +
            '&dtFin=' +
            this.formatDateFin(dtFin)
        );
    }
    getSeriesPie2(): Observable<any> {
        var filiais = this.param.filial;
        var dtIni = this.param.dtIni;
        var dtFin = this.param.dtFin;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/517/data?' +
            'filiais=' +
            filiais +
            '&dtIni=' +
            this.formatDateIni(dtIni) +
            '&dtFin=' +
            this.formatDateFin(dtFin)
        );
    }
    getSeriesM2(): Observable<any> {
        var filiais = this.param.filial;
        var dtIni = this.param.dtIni;
        var dtFin = this.param.dtFin;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/518/data?' +
            'filiais=' +
            filiais +
            '&dtIni=' +
            this.formatDateIni(dtIni) +
            '&dtFin=' +
            this.formatDateFin(dtFin)
        );
    }
    getSeriesHeat(): Observable<any> {
        var filiais = this.param.filial;
        var dtIni = this.param.dtIni;
        var dtFin = this.param.dtFin;

        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/520/data?' +
                'filiais=' +
                filiais +
                '&dtIni=' +
                this.formatDateIni(dtIni) +
                '&dtFin=' +
                this.formatDateFin(dtFin)

        );


    }
    getSeriesMixed(): Observable<any> {
        var filiais = this.param.filial;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/523/data?' +
                'filiais=' +
                filiais
        );
    }
    constructor(private _httpClient: HttpClient) {}
}
