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

    _colors = {
        palette1:  ['#008FFB','#00E396','#FEB019','#FF4560','#775DD0'],
        palette2:  ['#3F51B5','#03A9F4','#4CAF50','#F9CE1D','#FF9800'],
        palette3:  ['#33B2DF','#546E7A','#D4526E','#13D8AA','#A5978B'],
        palette4:  ['#4ECDC4','#C7F464','#81D4FA','#546E7A','#FD6A6A'],
        palette5:  ['#2B908F','#F9A3A4','#90EE7E','#FA4443','#69D2E7'],
        palette6:  ['#449DD1','#F86624','#EA3546','#662E9B','#C5D86D'],
        palette7:  ['#D7263D','#1B998B','#2E294E','#F46036','#E2C044'],
        palette8:  ['#662E9B','#F86624','#F9C80E','#EA3546','#43BCCD'],
        palette9:  ['#5C4742','#A5978B','#8D5B4C','#5A2A27','#C4BBAF'],
        palette10: ['#A300D6','#7D02EB','#5653FE','#2983FF','#00B1F2']
      };

    updateOrder= false;
    showOrder= 'ROL,LB,MB,DIAS';
    series = {columns: [], rows: [], viewSerie: []};
    viewSerie = new Array();
    exibirAxis = [
        {
            name : "ROL",
            exibir : true,
            showYAxis : true,
            seriesName: "ROL",
            cor : this._colors.palette1[0]
        },
        {
            name : "LB",
            exibir : true,
            showYAxis : false,
            seriesName: "LB",
            cor : this._colors.palette1[1]
        },
        {
            name : "MB",
            exibir : true,
            showYAxis : true,
            seriesName: "MB",
            cor : this._colors.palette1[2]
        },
        {
            name : "DIAS",
            exibir : true,
            showYAxis : false,
            seriesName: "DIAS",
            cor : this._colors.palette1[3]
        },
        {
            name : "QTDE",
            exibir : false,
            showYAxis : false,
            seriesName: "QTDE",
            cor : this._colors.palette1[4]
        },
        {
            name : "CMV",
            exibir : false,
            showYAxis : true,
            seriesName: "ROL",
            cor : this._colors.palette2[0]
        },
        {
            name : "ROB",
            exibir : false,
            showYAxis : false,
            seriesName: "ROL",
            cor : this._colors.palette2[1]
        },
        {
            name : "IMPOSTOS",
            exibir : false,
            showYAxis : false,
            seriesName: "IMPOSTOS",
            cor : this._colors.palette2[2]
        },
        {
            name : "ROL DIA",
            exibir : false,
            showYAxis : true,
            seriesName: "ROL DIA",
            cor : this._colors.palette2[3]
        },
        {
            name : "LB DIA",
            exibir : false,
            showYAxis : false,
            seriesName:  "LB DIA",
            cor : this._colors.palette2[4]
        },
        {
            name : "QTDE DIA",
            exibir : false,
            showYAxis : false,
            seriesName: "QTDE DIA",
            cor : this._colors.palette3[0]
        },
        {
            name : "CMV DIA",
            exibir : false,
            showYAxis : false,
            seriesName: "CMV DIA",
            cor : this._colors.palette3[1]
        },
        {
            name : "ROB DIA",
            exibir : false,
            showYAxis : false,
            seriesName: "ROL DIA",
            cor : this._colors.palette3[2]
        }
    ];


    viewYAxis = [{
        show: true,
        seriesName:  this.exibirAxis[0].showYAxis, // 'ROL',
      //   title: {
      //     text: 'ROL',
      //     style: {
      //       color: this._serviceChart._colors.palette1[0],
      //       fontSize: '12px',
      //       fontFamily: 'Helvetica, Arial, sans-serif',
      //       fontWeight: 40,
      //       cssClass: 'apexcharts-yaxis-title',
      //     }
      //   },
        labels: {
          show: true,
          minWidth: 0,
          maxWidth: 40,
          style: {
            colors: this._colors.palette1[0],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        },
        tooltip: {
          enabled: false
        }
      },
      {
        show: false,
        seriesName:  this.exibirAxis[1].showYAxis, //'LB',
      //   title: {
      //     text: 'LB',
      //     style: {
      //       color: this._serviceChart._colors.palette1[1],
      //       fontSize: '12px',
      //       fontFamily: 'Helvetica, Arial, sans-serif',
      //       fontWeight: 40,
      //       cssClass: '',
      //     }
      //   },
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 30,
          style: {
            colors: this._colors.palette1[1],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: true,
        seriesName:  this.exibirAxis[2].showYAxis, //'MB',
      //   title: {
      //     text: 'MB',
      //     style: {
      //       color: this._serviceChart._colors.palette1[2],
      //       fontSize: '12px',
      //       fontFamily: 'Helvetica, Arial, sans-serif',
      //       fontWeight: 40,
      //       cssClass: 'apexcharts-yaxis-title',
      //     }
      //   },
        labels: {
          show: true,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette1[2],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName:  this.exibirAxis[3].showYAxis, //'DIAS',
      //   title: {
      //     text: 'DIAS',
      //     style: {
      //       color: this._serviceChart._colors.palette1[3],
      //       fontSize: '12px',
      //       fontFamily: 'Helvetica, Arial, sans-serif',
      //       fontWeight: 40,
      //       cssClass: 'apexcharts-yaxis-title',
      //     }
      //   },
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette1[3],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName:  this.exibirAxis[4].showYAxis, //'QTDE',
      //   title: {
      //     text: 'QTDE',
      //     style: {
      //       color: this._serviceChart._colors.palette1[4],
      //       fontSize: '12px',
      //       fontFamily: 'Helvetica, Arial, sans-serif',
      //       fontWeight: 40,
      //       cssClass: 'apexcharts-yaxis-title',
      //     }
      //   },
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette1[4],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[5].showYAxis, //'CMV',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette2[0],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[6].showYAxis, //'ROB',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette2[1],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[7].showYAxis, //'IMPOSTOS',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette2[2],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[8].showYAxis, //'ROL_DIA',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette2[3],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[9].showYAxis, //'LB_DIA',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette2[4],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[10].showYAxis, //'QTDE_DIA',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette3[0],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[11].showYAxis, //'CMV_DIA',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette3[1],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      },
      {
        show: false,
        seriesName: this.exibirAxis[12].showYAxis, //'ROB_DIA',
        labels: {
          show: false,
          minWidth: 0,
          maxWidth: 600,
          style: {
            colors: this._colors.palette3[2],
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: (val) => {return(this.formatadorUnidade(val))}
        }
      }
    ];

    xAxis = new Array();
    getXaxis(){

        if(!this.dt_ref){
            const sysDate = new Date();
            var dia = (sysDate.getDate()-1);
            var mes =(sysDate.getMonth()+1);
            var ano = sysDate.getFullYear();

        }else{

            var dataSplit = this.dt_ref.split('/',3);
            var dia = Number(dataSplit[0]);
            var mes = Number(dataSplit[1]);
            var ano = Number(dataSplit[2]);
        }

        var elXaxis= new Array();
        var imes  = mes + Number(String((this.qtdemeses/12) ).substring(0,1)) ;
        var p_ano = ano - Number(String((this.qtdemeses/12) ).substring(0,1));

        for (let index = 1; index <= this.qtdemeses; index++) {

            elXaxis.push((this.meses[imes] + '/' + p_ano));

            if (imes == 12 ){
                imes = 1 ;
                p_ano++;
            }else{
                imes =  imes + 1 ;
            }

        }

        this.xAxis = elXaxis
    }

    param = {
        mes: null,
        ano: null,
        ultDia:null,
        filial: 99,
        descFilial: 'REDE',
        marca: 'null'
      };

    setParam(ultDia,mes, ano, filial,descFilial,marca){

        this.param.ultDia       = ultDia;
        this.param.mes          = mes;
        this.param.ano          = ano;
        this.param.filial       = filial;
        this.param.descFilial   = descFilial;
        this.param.marca        = marca;

    }
    formatadorUnidade(val){
        var numero = val? Number(val).toFixed(0) : '0';
        var valor = numero;

        if (String(numero).length < 4) {
            valor = numero;
        }else{
            if (String(numero).length < 7) {
                valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
            } else {
                if (String(numero).length < 8) {
                    valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'M';
                } else {
                    if (String(numero).length < 9) {
                        valor = numero.substring(0,2) +','+ numero.substring(1,2) + 'M';
                    }else{
                        if (String(numero).length < 10) {
                        valor = numero.substring(0,3) +','+ numero.substring(1,2) + 'M';
                        }else{
                            if (String(numero).length < 17) {
                                valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                            }
                        }
                    }
                }
            }
        }
        return valor;
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
