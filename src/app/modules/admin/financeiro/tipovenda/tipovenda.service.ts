import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class tipovendaService {

  constructor() { }
  viewSerie = new Array();
    viewYAxis = [{
        show: true,
        seriesName:  true, // 'ROL',
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
            cssClass: 'apexcharts-yaxis-label'
          },
          formatter: function(val) {
              var numero = val? val.toFixed(0) : '0';

              var valor = numero;
              if (String(numero).length < 4) {
                  valor = numero;
              }else{
                  if (String(numero).length < 7) {
                      valor =  numero.substring(0,1) +','+ numero.substring(1,2) +'K';
                  } else {
                      if (String(numero).length < 11) {
                          valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'M';
                      }else{
                          if (String(numero).length < 17) {
                              valor = numero.substring(0,1) +','+ numero.substring(1,2) + 'B';
                          }
                      }
                  }
              }

              return valor;
          }
        },
        tooltip: {
          enabled: false
        }
      }];
}
