import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectfilialService {

 private _data: BehaviorSubject<any> = new BehaviorSubject(null);

 readonly REPORT_FILTRO_FILIAIS = '101';
 readonly INITIAL_COMPANIES_IDS = ['null'];

  constructor(private _httpClient : HttpClient) { }

  get data$(): Observable<any> {
    return this._data.asObservable();
  }

  getData(dtIni, dtFin, companiesIds, sellersIds): Observable<any> {
    let url = `http://10.2.1.108/v1/dashboards/data?reportId=${this.REPORT_FILTRO_FILIAIS}`;

    return this._httpClient.get(url).pipe(
        tap((response: any) => {

            const COD_EMPRESA = 0;
            const RAZAO_ABREV = 1;

            const companyFilter = response[this.REPORT_FILTRO_FILIAIS][
                'rows'
            ].map((item) => {
                return {
                    id: item[COD_EMPRESA],
                    string:
                        item[COD_EMPRESA].toString() +
                        ' - ' +
                        item[RAZAO_ABREV],
                };
            });

            const dashData = {
                filiaisLista: companyFilter,
            };
            this._data.next(dashData);
        })
    );
}
}
