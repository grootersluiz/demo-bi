import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendafilialchartService {

  constructor(private _http: HttpClient) {

    this.getCategorias();

    this.getSeries();

  }

  categorias = new Array();
  getCategorias(){
  
    const sysDate = new Date();
    var dia = sysDate.getDate() ;

    var contDia: string;
    for (let index = 1 ; index < dia; index++) {
      
      contDia = ("00" + index).slice(-2) ;
      this.categorias.push(contDia);
      
    }

    // return this.categorias;
  }

  series = {columns: [], rows: []};
  getSeries(){

    const sysDate = new Date();
    var dia = ("00" + (sysDate.getDate()-1)).slice(-2);
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2);
    var ano = sysDate.getFullYear();

    this._http.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/329/data?ano='+ano+'&mes='+mes+'&dtref1=01'+mes+ano+'&dtref2='+dia+mes+ano)
                            .subscribe(dataresponse => {
                                 this.series.columns  = dataresponse.columns;
                                 this.series.rows     = dataresponse.rows;
                            });
    // return this.series;
  }

}
