import { Component} from '@angular/core';
import { VendafilialService } from './vendafilial.service';
<<<<<<< HEAD
import { Observable, async } from 'rxjs';
=======
import { Observable } from 'rxjs';
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6

import { formatNumber } from '@angular/common';

import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
<<<<<<< HEAD
import { ArrayDataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
=======
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6

export interface TipoColumaElement {
  NOMEFANTASIA: string;
  METAROL: number;
  REALROL: number;
  REALROLINTERCOMP: number;
  REALROLREGULAR: number;
  REALROLINSUMO: number;
  REALROLTOTAL: number;
  PROJECAO: number;
  ATINGMETAROL: number;
  GAPMETAROL: number;
  METAVDROL: number;
  REALVDROL: number;
  DIFMETAROL: number;
  NOVAMETAROL: number;
  METAMB: number;
  REALMB: number;
  DIFMB: number;
  METALB: number;
  REALLB: number;
  PROJECAOLB: number;
  ATINGMETALB: number;
  GAPMETALB: number;
  METAPMV: number;
  REALPMV: number;
  DIFPMV: number;
  METACC: number;
  REALCC: number;
  DIFCC: number;
}

let ELEMENT_DATA_VENDA: TipoColumaElement[];

@Component({
  selector: 'app-vendafilial',
  templateUrl: './vendafilial.component.html',
  styleUrls: ['./vendafilial.component.scss']
})

export class VendafilialComponent {

  cabecalho: string[] = [ 'NOMEFANTASIA'
                        , 'METAROL'
                        , 'REALROL'
                        , 'REALROLINTERCOMP'
                        , 'REALROLREGULAR'
                        , 'REALROLINSUMO'
                        , 'REALROLTOTAL'
                        , 'PROJECAO'
                        , 'ATINGMETAROL'
                        , 'GAPMETAROL'
                        , 'METAVDROL'
                        , 'REALVDROL'
                        , 'DIFMETAROL'
                        , 'NOVAMETAROL'
                        , 'METAMB'
                        , 'REALMB'
                        , 'DIFMB'
                        , 'METALB'
                        , 'REALLB'
                        , 'PROJECAOLB'
                        , 'ATINGMETALB'
                        , 'GAPMETALB'
                        , 'METAPMV'
                        , 'REALPMV'
                        , 'DIFPMV'
                        , 'METACC'
                        , 'REALCC'
                        , 'DIFCC'
                      ];

  dataSource = ELEMENT_DATA_VENDA;
<<<<<<< HEAD
  _sysdate:string;

  _elementFilter: any;
  _elementRenderer: any;
  _thishttpClient: any;

  formataDataSource(lista){

=======

  _elementFilter: any;
  _elementRenderer: any;

  constructor(private vendafilialService: VendafilialService,private _element: ElementRef,private _renderer: Renderer2){

    this._elementFilter   = _element;
    this._elementRenderer = _renderer;

    var lista = this.vendafilialService.data$[1];
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6
    var dataSourceVendaElemente ;
    var arrayTeste = [];

    var basecolor = "inline-flex items-center px-2.5 rounded-full text-xs font-bold"
    var red = "bg-red-200 dark:bg-red-600 dark:text-red-50 text-red-800 " + basecolor;
    var orange = "bg-orange-200 dark:bg-orange-600 dark:text-orange-50 text-orange-800 "+ basecolor;
    var green = "bg-green-200 dark:bg-green-600 dark:text-green-50 text-green-800 "+ basecolor;

    for (var i =0; i < lista.length; i++) {

      dataSourceVendaElemente = {
                  NOMEFANTASIA:       lista[i][0],
                  METAROL:            formatNumber(lista[i][1],'en-US','0.0-0'),
                  REALROL:            formatNumber(lista[i][2],'en-US','0.0-0'),
                  REALROLINTERCOMP:   formatNumber(lista[i][3],'en-US','0.0-0'),
                  REALROLREGULAR:     formatNumber(lista[i][4],'en-US','0.0-0'),
                  REALROLINSUMO:      formatNumber(lista[i][5],'en-US','0.0-0'),
                  REALROLTOTAL:       formatNumber(lista[i][6],'en-US','0.0-0'),
                  PROJECAO:           formatNumber(lista[i][7],'en-US','0.0-0'),
                  ATINGMETAROL:       formatNumber(lista[i][8],'en-US','0.2-2'),
                  colorATINGMETAROL:  lista[i][8]< 90? red : lista[i][8]>90 && lista[i][8]<100? orange : green ,
                  GAPMETAROL:         formatNumber(lista[i][9],'en-US','0.0-0'),
                  colorGAPMETAROL:    lista[i][9] > 0 ? green: red,
                  METAVDROL:          formatNumber(lista[i][10],'en-US','0.0-0'),
                  REALVDROL:          formatNumber(lista[i][11],'en-US','0.0-0'),
                  DIFMETAROL:         formatNumber(lista[i][12],'en-US','0.2-2'),
                  colorDIFMETAROL:    lista[i][12] > 0 ? green: red,
                  NOVAMETAROL:        formatNumber(lista[i][13],'en-US','0.0-0'),
                  METAMB:             formatNumber(lista[i][14],'en-US','0.2-2'),
                  REALMB:             formatNumber(lista[i][15],'en-US','0.2-2'),
                  DIFMB:              formatNumber(lista[i][16],'en-US','0.2-2'),
                  colorDIFMB:         lista[i][16] > 0 ? green: red,
                  METALB:             formatNumber(lista[i][17],'en-US','0.0-0'),
                  REALLB:             formatNumber(lista[i][18],'en-US','0.0-0'),
                  PROJECAOLB:         formatNumber(lista[i][19],'en-US','0.0-0'),
                  ATINGMETALB:        formatNumber(lista[i][20],'en-US','0.2-2'),
<<<<<<< HEAD
                  colorATINGMETALB:   lista[i][20]< 90? red : lista[i][20]>90 && lista[i][20]<100? orange : green ,
                  GAPMETALB:          formatNumber(lista[i][21],'en-US','0.0-0'),
                  colorGAPMETALB:     lista[i][21] > 0 ? green: red,
                  METAPMV:            formatNumber(lista[i][22],'en-US','0.0-0'),
                  REALPMV:            formatNumber(lista[i][23],'en-US','0.0-0'),
                  DIFPMV:             formatNumber(lista[i][24],'en-US','0.2-2'),
                  colorDIFPMV:        lista[i][24] > 0 ? red : green,
                  METACC:             formatNumber(lista[i][25],'en-US','0.0-0'),
                  REALCC:             formatNumber(lista[i][26],'en-US','0.0-0'),
                  DIFCC:              formatNumber(lista[i][27],'en-US','0.0-0'),
                  colorDIFCC:         lista[i][27] > 0 ? green: red
=======
                  GAPMETALB:          formatNumber(lista[i][21],'en-US','0.0-0'),
                  METAPMV:            formatNumber(lista[i][22],'en-US','0.0-0'),
                  REALPMV:            formatNumber(lista[i][23],'en-US','0.0-0'),
                  DIFPMV:             formatNumber(lista[i][24],'en-US','0.2-2'),
                  METACC:             formatNumber(lista[i][25],'en-US','0.0-0'),
                  REALCC:             formatNumber(lista[i][26],'en-US','0.0-0'),
                  DIFCC:              formatNumber(lista[i][27],'en-US','0.0-0'),
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6
                };

        arrayTeste.push(dataSourceVendaElemente);
    }

<<<<<<< HEAD
    return arrayTeste;

  }

  
  _iconShowFilter: string       = 'filter_list';
  _tolltip_ShowFIlter: string   = 'On filtro';
=======
    this.dataSource = arrayTeste;

  }

  formatDataMesAno(dataPicker) {

    var mes = dataPicker.value.getMonth();

    mes = mes < 9 ? '0' + (mes+1) :  (mes+1);

    var dataMes = '01/'+ mes + '/'+ dataPicker.value.getUTCFullYear();

    dataPicker.targetElement.value = dataMes;
    return true;

  }

  _iconShowFilter: string       = 'filter_list_off';
  _tolltip_ShowFIlter: string   = 'Off filtro';
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6
  _classDashInicial: string[]   = ['flex','flex-col','p-0','w-4/5','sm:w-full','md:w-full','lg:w-4/5','xl:w-4/5','2xl:w-4/5'];
  _classFilterInicial: string[] = ['flex','flex-col','p-2','w-1/5','sm:w-full','md:w-full','lg:w-1/5','xl:w-1/5','2xl:w-1/5'];
  showFilter(thisEvent) {

    this._iconShowFilter      = this._iconShowFilter== 'filter_list'? 'filter_list_off' : 'filter_list';
    this._tolltip_ShowFIlter  = this._tolltip_ShowFIlter== 'On filtro'? 'Off filtro' : 'On filtro';

    var filterHidden = this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild.style.visibility ;

    if(filterHidden == 'hidden'){
      filterHidden = 'visible';
      var pClassDash    = this._classDashInicial;
      var pClassFilter  = this._classFilterInicial;
    }else{
      filterHidden = 'hidden';

      var pClassDash  = ['flex','flex-col','p-0','w-full','sm:w-full','md:w-full','lg:w-full','xl:w-full','2xl:w-full'];
<<<<<<< HEAD
      var pClassFilter= ['flex','flex-col','p-0','w-0'   ,'sm:h-0'   ,'md:h-0'   ,'lg:w-0'   ,'xl:w-0'   ,'2xl:w-0'];
=======
      var pClassFilter= ['flex','flex-col','p-0','w-0'   ,'sm:w-0'   ,'md:w-0'   ,'lg:w-0'   ,'xl:w-0'   ,'2xl:w-0'];
>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6
    }

    this._elementRenderer.setStyle(
      this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,
      'visibility',filterHidden
    );

    let classDashAtual    = this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild.classList;
    let classFilterAtual  = this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild.classList;

    var array1 = new Array();
    var array2 = new Array();
    for (let index = 0; index < classDashAtual.length; index++) {
      const iDash   = classDashAtual[index];
      const iFilter = classFilterAtual[index];

      array1.push(iDash);
      array2.push(iFilter);

    }

    for (var index = 0; index < array1.length; index++) {
      const iDash   = array1[index];
      const iFilter = array2[index];

      this._elementRenderer.removeClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild,iDash);
      this._elementRenderer.removeClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,iFilter);

    }

    for (let index = 0; index < pClassDash.length; index++) {
      const iDash   = pClassDash[index];
      const iFilter = pClassFilter[index];

      this._elementRenderer.addClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.lastElementChild,iDash);
      this._elementRenderer.addClass(this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,iFilter);
      
    }

    return true;

  }

<<<<<<< HEAD
  /////////////////////////////////////// Construtor  ///////////////////////////////////////////////
  constructor(private vendafilialService: VendafilialService
              ,private _element: ElementRef
              ,private _renderer: Renderer2
              ,private _httpClient : HttpClient){

    this._elementFilter   = _element;
    this._elementRenderer = _renderer;
    this._thishttpClient = _httpClient;

    const sysDate = new Date();
    var mes = ("00" + sysDate.getMonth()).slice(-2) ;
    this._sysdate  = '('+mes+'/'+sysDate.getFullYear() +')';

    var lista = this.vendafilialService.data$[1];

    var arrayDataSource =  this.formataDataSource(lista);

    this.dataSource = arrayDataSource;

    //Ajuste para renderizar class 
    setTimeout(() => {
      this._elementRenderer.setStyle(
        this._elementFilter.nativeElement.firstElementChild.lastElementChild.firstElementChild,
        'visibility','hidden'
      );
      this.showFilter('');
    }, 500);

  }

  formatDataMesAno(dataPicker) {

    var mes = dataPicker.value.getMonth();

    mes = mes < 9 ? '0' + (mes+1) :  (mes+1);

    var dataMes = '01/'+ mes + '/'+ dataPicker.value.getUTCFullYear();

    dataPicker.targetElement.value = dataMes;
    return true;

  }


  consulatvendafilial(param ){

    // var dtRef = this._elementFilter.nativeElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.offsetParent.firstElementChild.childNodes[4].value;
    var dtRef = param;
    var arrayParam = new Array();

    arrayParam.push(dtRef);

    var dataSplit = arrayParam[0].split('/',3);
    this._sysdate = '('+dataSplit[1]+'/'+dataSplit[2]+')';
    const lastDay = new Date(dataSplit[2], dataSplit[1] , 0);
    const lastDayDate = lastDay.toLocaleDateString(); // ultimo dia do mês

    this._thishttpClient.get('http://api.portal.jspecas.com.br/v1/views/163/data?ano='+dataSplit[2]+'&mes='+dataSplit[1]+'&dtref='+lastDayDate)
                            .subscribe(dataresponse => {
                                      var arrayDataSource = this.formataDataSource(dataresponse.rows);
                                      this.dataSource = arrayDataSource;
                                });   

    // Não foi utilizado getDataAplica devido asyncronidade na atualização do dataSource
    // var dataGet = this.vendafilialService.getDataAplica(arrayParam);
        // setTimeout(() => {
        // var lista = this.vendafilialService.data$[1];
        // var arrayDataSource =  this.formataDataSource(lista);
        // this.dataSource = arrayDataSource;
        // console.log(this.dataSource);
      // }, 600);

  }

=======
  consulatvendafilial(param ){

    
    console.log(this._elementFilter);


    var dtRef = this._elementFilter.nativeElement.lastElementChild.lastElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.offsetParent.firstElementChild.childNodes[4].value;

    var arrayParam = new Array();

    arrayParam.push(dtRef);
    // var params = new Observable<{data:String[];}>;

    this.vendafilialService.getDataAplica(arrayParam);
    

  }


>>>>>>> 214dc12123833e3c890241acb133fcf44c3f5cd6
}
