import { ChangeDetectorRef, Component,OnInit, Injectable } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { FormControl } from '@angular/forms';
import { ListamarcaService } from './listamarca.service';

@Component({
  selector: 'app-listamarca',
  templateUrl: './listamarca.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./listamarca.component.scss','../css/css.component.scss'],
})

@Injectable()
export class ListamarcaComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _listamarcaservice: ListamarcaService,
        private _cdr: ChangeDetectorRef,
    ) {

    }

    sellersSearchInput = new FormControl('');
    marcas = new FormControl(this._listamarcaservice.INITIAL_SELLERS_IDS);
    selectedSellers = new FormControl([]);

    marcasObjects: { id: number; string: string }[];
    filteredMarcasObjects: { id: number; string: string }[];
    marcasStringList: string[];
    filteredMarcasStringList: string[];
    allSellersSelected: boolean = false;

    onInput(value: string) {

        const filteredSellers = this.marcasObjects.filter((seller) =>
            seller.string.toLowerCase().includes(value.toLowerCase())
        );
        const filteredSellersString = this.marcasStringList.filter(
            (seller) => seller.toLowerCase().includes(value.toLowerCase())
        );
        this.filteredMarcasStringList = filteredSellersString;
        this.filteredMarcasObjects = filteredSellers;
    }

    selectAllSellers() {
        if (this.allSellersSelected || this.marcasObjects.length === 0) {
            this.marcas.setValue(this._listamarcaservice.INITIAL_SELLERS_IDS);
            this.selectedSellers.setValue([]);
            this.allSellersSelected = false;
        } else {
            let newMarcas = this.filteredMarcasObjects.map((item) =>
                item.id.toString()
            );
            this.marcas.setValue(newMarcas);
            this.selectedSellers.setValue(newMarcas);
            this.allSellersSelected = true;
        }
    }

    handleSellersFilterSelect(marcaId: number) {
        const id = marcaId.toString();
        if (this.marcas.value.includes(id)) {
            this.selectedSellers.setValue([...this.selectedSellers.value, id]);
        } else {
            const updatedItems = this.selectedSellers.value.filter(
                (item) => item !== id
            );
            this.selectedSellers.setValue(updatedItems);
        }
        this.marcas.setValue(this.selectedSellers.value);

        if (this.marcas.value.length == 0) {
            this.marcas.setValue(this._listamarcaservice.INITIAL_SELLERS_IDS);
        }
        if (this.selectedSellers.value.length > 0) {
            this.allSellersSelected = true;
        } else {
            this.allSellersSelected = false;
        }
    }

    ngOnInit(): void {
        // ngAfterViewInit(): void {
            this._listamarcaservice.getData();

            // Get the data
            this._listamarcaservice.data$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data) => {
                    // Store the data
                    this.marcasObjects = data;

                    if(this.marcasObjects){

                        this.marcasObjects = data;
                        this.marcasStringList = this.marcasObjects.map(
                            (item) => item.string
                        );

                        this.filteredMarcasObjects = this.marcasObjects;
                        this.filteredMarcasStringList = this.marcasStringList;

                        this._cdr.markForCheck();

                    }

                });

        }

}
