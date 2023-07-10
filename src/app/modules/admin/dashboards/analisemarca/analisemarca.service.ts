import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, filter } from 'rxjs';
import { AnalisemarcaComponent } from './analisemarca.component';

@Injectable({
    providedIn: 'root',
})
export class AnalisemarcaService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    dt_ref = null;
    meses = [null,
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez'];

    qtdemeses = 12;
    xAxis = new Array();
    getXaxis(){

        if(!this.dt_ref){
            const sysDate = new Date();
            var dia = (sysDate.getDate()-1);
            var mes =(sysDate.getMonth()+1);
            var ano = sysDate.getFullYear();
            //const lastDayDate = dia + mes + sysDate.getFullYear();

        }else{

            var dataSplit = this.dt_ref.split('/',3);
            var dia = Number(dataSplit[0]);
            var mes = Number(dataSplit[1]);
            var ano = Number(dataSplit[2]);
        }

        var elXaxis= new Array();
        // var imes  = mes;
        // var p_ano = ano;
        var imes  = mes + Number(String((this.qtdemeses/12) ).substring(0,1)) ;
        var p_ano = ano - Number(String((this.qtdemeses/12) ).substring(0,1));

        for (let index = 1; index <= this.qtdemeses; index++) {

            elXaxis.push((this.meses[imes] + '/' + p_ano));

            // if (imes == 1 ){
            //     imes = 12 ;
            //     p_ano--;
            // }else{
            //     imes =  imes - 1 ;
            // }

            if (imes == 12 ){
                imes = 1 ;
                p_ano++;
            }else{
                imes =  imes + 1 ;
            }

        }

        this.xAxis = elXaxis
        // console.log(this.xAxis);

    }

    param = {
        mes: null,
        ano: null,
        ultDia:null,
        filial: 99,
        descFilial: 'REDE'
      };

    setParam(ultDia,mes, ano, filial,descFilial){

        this.param.ultDia       = ultDia;
        this.param.mes          = mes;
        this.param.ano          = ano;
        this.param.filial       = filial;
        this.param.descFilial   = descFilial;

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

        // return this._httpClient.get<{data:String[];}>('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+sysDate.getFullYear()+'&mes='+mes+'&dtref='+lastDayDate).pipe(
        //     tap((response: any) => {
        //         this._data.next([response.columns,response.rows]);
        //     })
        // );

        return null;
    }

    private vendafilialcom : AnalisemarcaComponent;

    async getDataAplica(param) {

        var dataSplit = param[0].split('/',3);

        const lastDay = new Date(dataSplit[2], dataSplit[1] , 0);
        const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

        // this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+dataSplit[2]+'&mes='+dataSplit[1]+'&dtref='+lastDayDate)
        //                         .subscribe(dataresponse => {
        //                              this._data.next([dataresponse.columns,dataresponse.rows]);
        //                         });

    }
}
