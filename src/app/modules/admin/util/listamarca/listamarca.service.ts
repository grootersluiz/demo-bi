import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap , map, pipe} from 'rxjs';

import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ListamarcaService {

    private _data: BehaviorSubject<any> = new BehaviorSubject([]);

    readonly INITIAL_SELLERS_IDS = ['null'];
    readonly REPORT_FILTRO_MARCAS = '1';

    constructor(private _httpClient: HttpClient) {}

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    formatDate(date) {
        const day = date.date.toString();
        const month = (date.month + 1).toString();
        const year = date.year.toString();
        return `${day}/${month}/${year}`;
    }

    getData() {

        let url = `http://10.2.1.108/v1/views/510/data?`;

        return this._httpClient.get<Observable<any>>(url)
            .subscribe((dataresponse: any) => {

                const COD_EMPRESA = 0;
                const RAZAO_ABREV = 1;

                const marcaFilter = dataresponse.rows.map((item) => {
                    return {
                        id: Number(item[0]),
                        string: item[0].toString() + ' - ' + item[1],
                    };
                });

                // console.log(marcaFilter)
                this._data.next(marcaFilter);
                // this._data.next(null);
            });


        // return this._httpClient.get(url).pipe(
        //     tap((response: any) => {
        //         const sellersFilter = response[this.REPORT_FILTRO_MARCAS].map((item) => {
        //             return {
        //                 id: item[0],
        //                 string: item[0].toString() + ' - ' + item[1],
        //             };
        //         });

        //         this._data.next(sellersFilter);
        //     })
        // );


    }

}
