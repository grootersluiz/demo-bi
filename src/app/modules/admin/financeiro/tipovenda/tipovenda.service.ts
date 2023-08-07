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

    param = {
        mes: null,
        ano: null,
        dtIni: null,
        dtFin: null,
        filial: 99,
        descFilial: 'REDE',
        marca: 'null',
    };

    seriesPie = [];

    formatDate(date) {
        if (date === null) {
            var sysdate = new Date();
            const day = sysdate.getDate().toString();
            const month = sysdate.getMonth().toString();
            const year = sysdate.getFullYear().toString();
            return `${day}/${month}/${year}`;
        } else {
            const day = date.date.toString();
            const month = (date.month + 1).toString();
            const year = date.year.toString();
            return `${day}/${month}/${year}`;
        }
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
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/514/data?' +
                'filiais=' +
                filiais
        );
    }
    getSeriesM1(): Observable<any> {
        var filiais = this.param.filial;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/515/data?' +
                'filiais=' +
                filiais
        );
    }
    getSeriesPie2(): Observable<any> {
        var filiais = this.param.filial;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/517/data?' +
                'filiais=' +
                filiais
        );
    }
    getSeriesM2(): Observable<any> {
        var filiais = this.param.filial;
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/518/data?' +
                'filiais=' +
                filiais
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
                this.formatDate(dtIni) +
                '&dtFin=' +
                this.formatDate(dtFin)

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
