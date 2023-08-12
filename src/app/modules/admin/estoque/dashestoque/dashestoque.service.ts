import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashEstoqueService {
   

    constructor(private _httpClient: HttpClient) {

    }



    getDiasEstoque(codemp: String[]): Observable<any> {
     
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/519/data?' +
            'codemp=' +
            codemp
        );
    }

    getGiroEstoque(codemp: String[]): Observable<any> {


        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/524/data?' +
            'codemp=' +
            codemp
        );
      
    }


    getDisponibilidadeCurva(codemp: String[]): Observable<any> {

       console.log(codemp);
        return this._httpClient.get<{ columns: []; rows: [] }>(
            'http://api.portal.jspecas.com.br/v1/views/526/data?'+'codemp=' +codemp
        );
      
    }

    getEstoquePorFornecedor(): Observable<any> {

       // console.log(codemp);
         return this._httpClient.get<{ columns: []; rows: [] }>(
             'http://api.portal.jspecas.com.br/v1/views/512/data?'

         );
       
     }
 
    /*
    getEstoquePorFornecedor() {
        this._httpClient.get<{ columns: [], rows: [] }>('http://api.portal.jspecas.com.br/v1/views/512/data?')
            .subscribe(dataresponse => {
                //this.estoquePorFornecedor = ;

                this.formatarEstoqueFornecedor(dataresponse.rows);


            });*/
    


}


