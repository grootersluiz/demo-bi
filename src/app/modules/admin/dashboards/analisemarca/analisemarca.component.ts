import { Component, Injectable,  ViewChild, Inject} from '@angular/core';
import {ElementRef, Renderer2 } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogContainer} from '@angular/material/dialog';
import {Directive, OnInit, Output,Input, EventEmitter} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AnalisemarcaService } from './analisemarca.service';

import ApexCharts from "apexcharts"; //está usando
import { ApexOptions } from 'ng-apexcharts'; //está usando
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexResponsive,
  ApexYAxis
} from "ng-apexcharts";
import { values } from 'lodash';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  yaxis: ApexYAxis[];
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-analisemarca',
  templateUrl: './analisemarca.component.html',
  styleUrls: ['./analisemarca.component.scss'],
})

@Injectable()
export class AnalisemarcaComponent {

  @ViewChild("chart") chart: ChartComponent;
  // @ViewChild("chart") _elChart: ElementRef;

  @ViewChild("containerFilter") _elFilter: ElementRef;
  @ViewChild("containerForm") _elForm: ElementRef;
  @ViewChild("containerDash") _elDash: ElementRef;
  @ViewChild("idModal") _elidModal: ElementRef;

  public chartOptions: Partial<ChartOptions>;

  viewSerie = new Array();

  animal: string;
  name: string;

  posicionaValorXinCategoria(categorias,rows){

    var keyX = 2;
    var codemp  = this.param.filial;
    var descemp = this.param.descFilial;

    var dataSerie= { name: '', data: [] };

    for (let iColumn = 1; iColumn < this.series.columns.length; iColumn++) {
        const element = this.series.columns[iColumn];

        dataSerie = { name: element, data: [] };

        var iPeriodo = 0;
        for (let iRow = 0; iRow < rows.length; iRow++) { // Array do periodo

            let valorKey  = rows[iRow];
            let mesNumber = valorKey[0].substr(3,2);
            let mesChar = this.analisemarcaService.meses[Number(mesNumber)];

            while(mesChar != categorias[iPeriodo].substr(0,3)){ //Valida peíodo existe, se não set valor 0.

                dataSerie.data.push(0);
                iPeriodo++;

                if(iPeriodo > 24){ break;}
            }

            var valor = !rows[iRow][iColumn] ? 0 : rows[iRow][iColumn];

            if(mesChar === categorias[iPeriodo].substr(0,3)){
                dataSerie.data.push(valor);
            }

            iPeriodo++;

        }

        this.series.viewSerie.push(dataSerie);

        this._serviceChart.series.viewSerie.push(dataSerie);

        var arrayView =  this._serviceChart.exibirAxis;

        for (let index = 0; index < arrayView.length; index++){

            var obj = arrayView[index];

            if(obj.exibir == true){

                if(obj.name === dataSerie.name){
                    this.viewSerie.push(dataSerie);
                    this._serviceChart.viewSerie.push(dataSerie);
                }
            }

        }

    }

    this.chartOptions.title.text =  " Dia ("+descemp+")";
    this.chartOptions.series = this.viewSerie;
    this.chartOptions.xaxis.categories = categorias;

    // Ajuste realizar reflow no chart //////////////////////////////////////////
    var chart = new ApexCharts(this.chart, this.chartOptions);
    // this.showFilter('',this._elFilter.nativeElement,this._elForm.nativeElement,this._elDash.nativeElement);
    // setTimeout(() => {
    //   this.showFilter('',this._elFilter.nativeElement,this._elForm.nativeElement,this._elDash.nativeElement);
    // }, 50);
    /////////////////////////////////////////////////////////////////////////////

  }

  param = {
            mes: null,
            ano: null,
            ultDia:null,
            filial:null,
            descFilial: null
          };

  validaParam(){

    this.param.ultDia     = this.analisemarcaService.param.ultDia;
    this.param.mes        = this.analisemarcaService.param.mes;
    this.param.ano        = this.analisemarcaService.param.ano;
    this.param.filial     = this.analisemarcaService.param.filial;
    this.param.descFilial = this.analisemarcaService.param.descFilial;

    if(!this.param.ano){

      const sysDate = new Date();
      this.param.ultDia = ("00" + (sysDate.getDate()-1)).slice(-2); // dia atual -1
      this.param.mes    = ("00" + (sysDate.getMonth()+1)).slice(-2);
      this.param.ano    = sysDate.getFullYear();
      this.param.filial = 99;
      this.param.descFilial = 'REDE';

    }
  }

  categorias = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
  getCategorias(){

    var dia = parseInt(this.param.ultDia);

    var contDia: string;
    for (let index = 1 ; index <= dia; index++) {

      contDia = ("00" + index).slice(-2) ;
      this.categorias.push(contDia);

    }

  }

  series = {columns: [], rows: [], viewSerie: []};
  getSeries(){

    var dia = this.param.ultDia;
    var mes = this.param.mes;
    var ano = this.param.ano;

    this._httpClient.get<{columns: [], rows: []}>('http://api.portal.jspecas.com.br/v1/views/429/data?ano='+ano+'&mes='+mes+'&dtref1=01'+mes+ano+'&dtref2='+dia+mes+ano)
                            .subscribe(dataresponse => {
                                 this.series.columns  = dataresponse.columns;
                                 this.series.rows     = dataresponse.rows;

                                //  this._serviceChart.series.columns  = dataresponse.columns;
                                //  this._serviceChart.series.rows     = dataresponse.rows;

                                //  console.log(this.series.rows);
                                 this.posicionaValorXinCategoria(this.categorias,this.series.rows);

                            });

  }

  limpar(){
    this.series = {columns: [], rows: [], viewSerie: []};
    this.categorias = new Array();
    this.viewSerie = new Array();

  }

  _sysdate:string;
  _elementRef: any;
  _elementRenderer: any;
  _thishttpClient: any;
  _containerChart: any;
  _serviceChart: any;
  _chartWidth = '99%';
  _iconShowFilter: string       = 'filter_list_off';
  _tolltip_ShowFIlter: string   = 'Off filtro';
  _classChart = 'grid rounded-2xl p-0 mt-0 mr-0 mb-0 ml-0';
  _classDashInicial: string[]   = ['flex','flex-row','p-0','w-10/12','sm:w-10/12','md:w-10/12','lg:w-10/12','xl:w-10/12','2xl:w-10/12','mt-0','mr-0','mb-0','ml-0'];
  _classFilterInicial: string[] = ['flex','flex-row','p-0','w-2/12','sm:w-12/12','md:w-12/12','lg:w-2/12','xl:w-2/12','2xl:w-2/12','mt-0','mr-2','mb-0','ml-0'];
  _exibirAxis: any;
  showFilter(thisEvent,elFilter,elForm,elDash) {

    // this._chartWidth = '99%';
    this._iconShowFilter      = this._iconShowFilter== 'filter_list'? 'filter_list_off' : 'filter_list';
    this._tolltip_ShowFIlter  = this._tolltip_ShowFIlter== 'On filtro'? 'Off filtro' : 'On filtro';

    var pClassDash  = ['flex','flex-row','p-0','w-10/12','sm:w-10/12','md:w-10/12','lg:w-10/12','xl:w-10/12','2xl:w-10/12','mt-0','mr-0','mb-0','ml-0'];
    var pClassFilter= ['flex','flex-row','p-0','w-2/12','sm:w-12/12','md:w-12/12','lg:w-2/12','xl:w-2/12','2xl:w-2/12','mt-0','mr-2','mb-0','ml-0'];

    if(!elFilter.hidden){
      elFilter.hidden = true;
      elForm.hidden   = true;
      // this._chartWidth = '99%';
      pClassDash  = ['grid','h-full','w-full','p-0','w-12/12','sm:w-12/12','md:w-12/12','lg:w-12/12','xl:w-12/12','2xl:w-12/12','mt-0','mr-0','mb-0','ml-0'];
      pClassFilter= ['flex','flex-col','p-0','w-0'   ,'sm:h-0'   ,'md:h-0'   ,'lg:w-0'   ,'xl:w-0'   ,'2xl:w-0','mt-0','mr-0','mb-0','ml-0'];

    }else{
      elFilter.hidden = false;
      elForm.hidden   = false;
      // this._chartWidth = '83%';
    }

    this._classDashInicial    = pClassDash;
    this._classFilterInicial  = pClassFilter;

    // Ajuste realizar reflow no chart //////////////////////////////////////////
    var chart = new ApexCharts(this.chart, this.chartOptions);
    /////////////////////////////////////////////////////////////////////////////

  }

  showDash(thisEvent) {

    if(thisEvent.hidden){
      thisEvent.hidden = false;
    }else{
      thisEvent.hidden = true;
    }
  }

  public menuFilialChart(el): void {

    this.analisemarcaService.param.filial = el.srcElement.attributes[1].value ;

    this.param.filial     = el.srcElement.attributes[1].value ;
    this.param.descFilial = el.srcElement.innerText ;

    this.analisemarcaService.setParam(this.param.ultDia,this.param.mes, this.param.ano, this.param.filial, this.param.descFilial );

    this.viewSerie = new Array();

    this.validaParam();
    this.posicionaValorXinCategoria(this.categorias,this.series.rows);

  }

  codEx = ['E1','E2','E3','E4','E5','E6','E7'];
  public mostraMenuFilial2Chart(el): void {

    if(!el){ return null;}

    for (let index = 0; index < this.codEx.length; index++) {

      var elMenuFiliais = document.getElementById('item'+this.codEx[index]);

      if(this.codEx[index] == el.srcElement.innerText ){

        if(elMenuFiliais.className == 'charts-menu2'){

          var classe ="charts-menu2 charts-menu-open";
          var classes = elMenuFiliais.className.split(' ');
          var getIndex = classes.indexOf(classe);

          if (getIndex === -1) {
            classes.push(classe);
            elMenuFiliais.className = classes.join(' ');
          }

        }
      } else{
        elMenuFiliais.className = "charts-menu2";
      }

    }

  }
  private dialogRef: any;
  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(public analisemarcaService: AnalisemarcaService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient
              ,public dialog: MatDialog){

    this._elementRef        = _element;
    this._elementRenderer   = _renderer;
    this._thishttpClient    = _httpClient;
    this._serviceChart      = analisemarcaService;
    this._exibirAxis        = analisemarcaService.exibirAxis;

    const sysDate = new Date();
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;
    this._sysdate  = '('+mes+'/'+sysDate.getFullYear() +')';

    this.validaParam();
    // this.getCategorias();
    this.getSeries();

    analisemarcaService.getXaxis();
    this.categorias = analisemarcaService.xAxis;

    // console.log(this.categorias);

    var iconFilial = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M226 896q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226 642q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226 388q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z"/></svg>`;
    var styleMenu = `<style>
                      .charts-menu {
                        background: #fff;
                        position: absolute;
                        top: 100%;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        padding: 3px;
                        right: 10px;
                        opacity: 0;
                        min-width: 80px;
                        transition: .15s ease all;
                        pointer-events: none;
                      }

                      .charts-menu-open {
                          opacity: 1 !important;
                          pointer-events: all !important;
                          transition: .15s ease all;
                      }

                      .charts-menu-item {
                          padding: 6px 7px;
                          font-size: 12px;
                          cursor: pointer;
                      }
                      .charts-menu-item:hover {
                        box-shadow: inset -30px -30px 30px 30px #efefef;
                      }

                      .charts-menu2 {
                        background: #fff;
                        position: absolute;
                        top: 10px;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        padding: 1px;
                        right: 80px;
                        opacity: 0;
                        min-width: 80px;
                        transition: .15s ease all;
                        pointer-events: none;
                      }

                      .charts-menu-item2 {
                        padding: 6px 7px;
                        font-size: 12px;
                        cursor: pointer;
                      }
                      .charts-menu-item2:hover {
                        box-shadow: inset -30px -30px 30px 30px #efefef;
                      }

                    </style>`;

    this.chartOptions = {
      series: this.viewSerie,
      chart: {
        animations: {
          enabled: false
        },
        width: this._chartWidth,
        height: '98%',
        type: "line",
        stacked: false,
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
        toolbar:{
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: true,
            zoomin: true,
            zoomout: true,
            reset: true,
            pan: false,
            customIcons: [{
              icon: iconFilial + styleMenu +
                    `<div class="charts-menu" id="menuFilial">
                      <div class="charts-menu-item" nodeValue="99"> Indicadores </div>
                    </div>`,
              index: 0,
              title: 'Filiais',
              class: 'apexcharts-menu-icon',
              click: function (chart, options, e) {

                var elemento = document.getElementById("menuFilial");

                if(elemento.className == 'charts-menu'){

                  var classe ="charts-menu charts-menu-open";
                  var classes = elemento.className.split(' ');
                  var getIndex = classes.indexOf(classe);

                  if (getIndex === -1) {
                    classes.push(classe);
                    elemento.className = classes.join(' ');
                  }

                }else{
                  elemento.className = "charts-menu";
                }
              }
            }]
          }
        }

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: " Dia ("+this.param.descFilial+")",
        align: "left"
      },
      yaxis: [
        {
          show: true,
          seriesName: 'ROL',
          title: {
            text: 'ROL',
            style: {
              color: this._serviceChart._colors.palette1[0],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            style: {
              colors: this._serviceChart._colors.palette1[0],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
              var valor = val? val.toFixed(0) : '';
              return valor;
            }
          }
        },
        {
          show: false,
          seriesName: 'LB',
          title: {
            text: 'LB',
            style: {
              color: this._serviceChart._colors.palette1[1],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: '',
            }
          },
          labels: {
            show: false,
            style: {
              colors: this._serviceChart._colors.palette1[1],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
              var valor = val? val.toFixed(0) : '';
              return valor;
            }
          }
        },
        {
          show: true,
          seriesName: 'MB',
          title: {
            text: 'MB',
            style: {
              color: this._serviceChart._colors.palette1[2],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            style: {
              colors: this._serviceChart._colors.palette1[2],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
              var valor = val? val.toFixed(2) : '';
              return valor;
            }
          }
        },
        {
          show: true,
          seriesName: 'DIAS',
          title: {
            text: 'DIAS',
            style: {
              color: this._serviceChart._colors.palette1[3],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: true,
            style: {
              colors: this._serviceChart._colors.palette1[3],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
              var valor = val? val.toFixed(2) : '';
              return valor;
            }
          }
        },
        {
          show: false,
          seriesName: 'QTDE',
          title: {
            text: 'QTDE',
            style: {
              color: this._serviceChart._colors.palette1[4],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-yaxis-title',
            }
          },
          labels: {
            show: false,
            style: {
              colors: this._serviceChart._colors.palette1[4],
              cssClass: 'apexcharts-yaxis-label'
            },
            formatter: function(val, index) {
              var valor = val? val.toFixed(0) : '';
              return valor;
            }
          }
        }
      ],
      xaxis: {
          type: 'category',
          categories: this.categorias
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


  }

  eventUpdateSomenteUmaVez = true; // Cuidado parametro Critico para loop Eterno!
  ngAfterViewInit(): void {

    // var elDialog = this.dialog.open(AnalisemarcaDialogComponent) ;

    // console.log(elDialog);

    // var elIdDialog = document.getElementById('dialogIndicadores');

    // console.log(elIdDialog);

    // this._elementRenderer.listen(elIdDialog,"click", event => {this.onChangeDialog(elIdDialog)});

    this.dialog.closeAll();

    window['Apex'] = {

        chart: {
            events: {
              click: (event: any, chartContext?: any, config? :any): void => {

                switch (event.srcElement.className) {
                  case "charts-menu-item":

                    // var filterHidden = null;
                    // var elModal = document.getElementById('idModal');
                    // console.log(elModal);

                    // console.log(this._elidModal.nativeElement);
                    // filterHidden = elModal.style.visibility;

                    // if(filterHidden == 'hidden'){
                    //     filterHidden = 'visible';
                    // }else{
                    //     filterHidden = 'hidden';
                    // }

                    // this._elementRenderer.setStyle(
                    //     elModal,
                    //     'visibility',filterHidden
                    // );

                    // const dialogRef = this.dialog.open(this._elidModal.nativeElement);

                    // dialogRef.afterClosed().subscribe(result => {
                    // console.log(`Dialog result: ${result}`);
                    // });


                    const dialogRef = this.dialog.open(AnalisemarcaDialogComponent);

                    console.log(dialogRef);
                    var elIdDialog = document.getElementById('dialogIndicadores');

                    var selIdDialog = document.querySelector("dialogIndicadores");

                    console.log(selIdDialog);
                    this._elementRenderer.listen(elIdDialog,"click", event => {this.onChangeDialog(selIdDialog)});


                //    var _eventOutput = this.onChangeDialog(dialogRef.componentInstance);

                //    console.log(_eventOutput);



                    // var compDialog : AnalisemarcaDialogComponent;

                    var elDialog = document.getElementById(dialogRef.id);

                    console.log(elDialog);
                    // dialogRef.afterClosed().subscribe((result) => {
                    //     console.log(result);
                    // });



                    //-----------------------------------------------------------------------------------------
                    // this.menuFilialChart(event);
                    // chartContext.updateOptions({
                    //     // title: {
                    //     //   text: " Dia ("+this.param.descFilial+")",
                    //     //   align: "left"
                    //     // },
                    //     series: this.viewSerie
                    // }) ;
                    break;
                  default:
                    break;
                }
              },
            //   mouseMove:(event: any, chartContext?: any, config? :any): void => {
            //     if(event.srcElement.className == "charts-menu-item"){
            //         this.mostraMenuFilial2Chart(event);
            //     }
            //   }
            }
        }
    };
  }


  formatDataMesAno(dataPicker) {

    if (!dataPicker.value){ return null}

    var mes = dataPicker.value._i.month;
    mes = ("00" + (mes+1)).slice(-2)
    var dataMes = '01/'+ mes + '/'+ dataPicker.value._i.year;
    dataPicker.targetElement.value = dataMes;

    return true;

  }

  formatDataMesAno2(dataPicker) {

    var value = dataPicker.value;

    if(value.length >= 8){
      var arrayData = value.split("/");

      if(arrayData.length ==1){
        dataPicker.value = '01/'+value.substr(2,2)+'/'+value.substr(4,4);

      }else{

        var mes =  ("00" + (arrayData[1])).slice(-2);
        var ano = arrayData[2];

        dataPicker.value = '01/'+mes+'/'+ano;
      }

    }
    return true;

  }

  consultavendafilial(param ){

    this.eventUpdateSomenteUmaVez = true; // Cuidado parametro Critico para loop Eterno! Chart->Events->Update

    // console.log(param);
    this._chartWidth = '83%';
    var dtRef = param;
    var arrayParam = new Array();

    arrayParam.push(dtRef);

    var dataSplit = arrayParam[0].split('/',3);
    this._sysdate = '('+dataSplit[1]+'/'+dataSplit[2]+')';
    const lastDay = new Date(dataSplit[2], dataSplit[1] , 0);
    const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

    const sysDate = new Date();
    var dia = ("00" + (sysDate.getDate()-1)).slice(-2) ;
    var mes = ("00" + (sysDate.getMonth()+1)).slice(-2) ;

    var dataref = lastDayDate;

    if(sysDate.getFullYear() == dataSplit[2] && mes == dataSplit[1]){ // Atualizar dia do mês atual
      dataref = dia + mes + sysDate.getFullYear();
    }
    var ano = dataSplit[2];
    mes = dataSplit[1];
    dia = lastDayDate.substring(0,2); // ultimo dia do mês

    this.analisemarcaService.setParam(dia,mes,ano,99,'REDE');
    this.limpar(); // viewSerie, categorias, series
    this.validaParam();
    this.getCategorias();
    this.getSeries();


  }

//   @Input() changeDialog ;
  onChangeDialog(evento){

    console.log(evento);
    console.log('Change Dialog');


  }



}

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-analisemarcadialog',
    templateUrl: './analisemarcadialog.component.html',
  })

  @Injectable()
  export class AnalisemarcaDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AnalisemarcaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _myService : AnalisemarcaService
      ) {

        //   console.log(_myService);

      }

    ngOnInit() {
    }

    // @Input() changeDialog ;
    @Output() responseChangeDialog = new EventEmitter();
    onClickcheck(el) {

        // console.log(this.dialogRef);
        console.log('responseChangeDialog');

        this.responseChangeDialog.emit(el);

        // console.log(this.changeDialog.emit());


        var valida = {
            campo: null,
            position: null
        };

        if(el.checked){
            // se true
            var arrayView =  this._myService.exibirAxis;
            var dataSerie = '';

            for (let index = 0; index < arrayView.length; index++){

                var obj = arrayView[index];

                if(obj.name === el.value){

                    dataSerie = this._myService.series.viewSerie[index];

                    this._myService.viewSerie.push(dataSerie);
                }

            }


            // console.log(this._myService);

            this._myService.series.rows = valida.position

            // Ajuste realizar reflow no chart //////////////////////////////////////////
            // var chart = new ApexCharts(this._myService.chart, this._myService.chartOptions);
            /////////////////////////////////////////////////////////////////////////////

        }

    }


      onNoClick(): void {
        this.dialogRef.close();
      }

  }

