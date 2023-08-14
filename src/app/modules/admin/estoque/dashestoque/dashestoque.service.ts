import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashEstoqueService {


    constructor(private _httpClient: HttpClient) {

    }



    getDiasEstoque(codemp, codparcforn, codmarca, curva): Observable<any> {

    /*var elemento: String = "";
      for (let index = 0; index < curva.length; index++) {
        elemento += elemento ? ",'" + curva[index] +"'" : "'" + curva[index] +"'";


      }*/

    

        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/519/data?' +
            'codemp=' +
            codemp +
            '&codparcforn='+
            codparcforn+
            '&codmarca='+
            codmarca+
            '&curva='+
            curva
        );
    }

    getGiroEstoque(codemp, codparcforn, codmarca, curva): Observable<any> {


        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/524/data?' +
            'codemp=' +
            codemp +
            '&codparcforn='+
            codparcforn+
            '&codmarca='+
            codmarca+
            '&curva='+
            curva
        );

    }


    getDisponibilidadeCurva(codemp, codparcforn, codmarca, curva): Observable<any> {


        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/526/data?'+
            'codemp=' +
            codemp +
            '&codparcforn='+
            codparcforn+
            '&codmarca='+
            codmarca+
            '&curva='+
            curva
        );

    }



    getDisponibilidadeEmpresa(codemp, codparcforn, codmarca, curva) {

        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/536/data?'+
            'codemp=' +
            codemp +
            '&codparcforn='+
            codparcforn+
            '&codmarca='+
            codmarca+
            '&curva='+
            curva
        );

    }

    getEstoquePorFornecedor(numero,codemp, codparcforn, codmarca, curva): Observable<any> {


         return this._httpClient.get<{ columns: []; rows: [] }>(
             'http://api.portal.jspecas.com.br/v1/views/512/data?'
             +'numero=' +
             numero +
             '&codemp=' +
             codemp +
             '&codparcforn='+
             codparcforn+
             '&codmarca='+
             codmarca+
             '&curva='+
             curva

         );

     }



}


