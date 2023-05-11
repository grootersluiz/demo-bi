import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, filter } from 'rxjs';
import { VendafilialComponent } from './vendafilial.component';

@Injectable({
    providedIn: 'root',
})
export class VendafilialService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    param = {
        mes: null,
        ano: null,
        ultDia:null,
        filial: 99
      };
    
    setParam(ultDia,mes, ano, filial){

        this.param.ultDia = ultDia;
        this.param.mes    = mes;
        this.param.ano    = ano;
        this.param.filial = filial;

        
        // console.log('Service');
        //  console.log(this.param);
    }
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.value;
    }

    getData(): Observable<{data:String[];}> {

        const sysDate = new Date();
        var dia = ("00" + (sysDate.getDate()-1)).slice(-2) ;
        var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;
        // const lastDay = new Date(sysDate.getFullYear(), sysDate.getMonth() , 0);
        // const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

        const lastDayDate = dia + mes + sysDate.getFullYear();
        
        return this._httpClient.get<{data:String[];}>('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+sysDate.getFullYear()+'&mes='+mes+'&dtref='+lastDayDate).pipe(
            tap((response: any) => {
                this._data.next([response.columns,response.rows]);
            })
        );
    }

    private vendafilialcom : VendafilialComponent;

    async getDataAplica(param) {

        var dataSplit = param[0].split('/',3);

        const lastDay = new Date(dataSplit[2], dataSplit[1] , 0);
        const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

        this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+dataSplit[2]+'&mes='+dataSplit[1]+'&dtref='+lastDayDate)
                                .subscribe(dataresponse => {
                                     this._data.next([dataresponse.columns,dataresponse.rows]);
                                });                                

    }
}
