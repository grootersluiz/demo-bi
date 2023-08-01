import { ChangeDetectorRef, Component,OnInit, Injectable } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { FormControl } from '@angular/forms';
import { ListafornecedorService } from './listafornecedor.service';

@Component({
  selector: 'app-listafornecedor',
  templateUrl: './listafornecedor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./listafornecedor.component.scss','../css/css.component.scss'],
})

@Injectable()
export class ListafornecedorComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _listafornecedorservice: ListafornecedorService,
        private _cdr: ChangeDetectorRef,
    ) {

    }

    sellersSearchInput = new FormControl('');
    fornecedores = new FormControl(this._listafornecedorservice.INITIAL_SELLERS_IDS);
    selectedSellers = new FormControl([]);

    fornecedoresObjects: { id: number; string: string }[];
    filteredFornecedoresObjects: { id: number; string: string }[];
    fornecedoresStringList: string[];
    filteredFornecedoresStringList: string[];
    allSellersSelected: boolean = false;

    onInput(value: string) {

        const filteredSellers = this.fornecedoresObjects.filter((seller) =>
            seller.string.toLowerCase().includes(value.toLowerCase())
        );
        const filteredSellersString = this.fornecedoresStringList.filter(
            (seller) => seller.toLowerCase().includes(value.toLowerCase())
        );
        this.filteredFornecedoresStringList = filteredSellersString;
        this.filteredFornecedoresObjects = filteredSellers;
    }

    selectAllSellers() {
        if (this.allSellersSelected || this.fornecedoresObjects.length === 0) {
            this.fornecedores.setValue(this._listafornecedorservice.INITIAL_SELLERS_IDS);
            this.selectedSellers.setValue([]);
            this.allSellersSelected = false;
        } else {
            let newFornecedores = this.filteredFornecedoresObjects.map((item) =>
                item.id.toString()
            );
            this.fornecedores.setValue(newFornecedores);
            this.selectedSellers.setValue(newFornecedores);
            this.allSellersSelected = true;
        }
    }

    handleSellersFilterSelect(fornecedorId: number) {
        const id = fornecedorId.toString();
        if (this.fornecedores.value.includes(id)) {
            this.selectedSellers.setValue([...this.selectedSellers.value, id]);
        } else {
            const updatedItems = this.selectedSellers.value.filter(
                (item) => item !== id
            );
            this.selectedSellers.setValue(updatedItems);
        }
        this.fornecedores.setValue(this.selectedSellers.value);

        if (this.fornecedores.value.length == 0) {
            this.fornecedores.setValue(this._listafornecedorservice.INITIAL_SELLERS_IDS);
        }
        if (this.selectedSellers.value.length > 0) {
            this.allSellersSelected = true;
        } else {
            this.allSellersSelected = false;
        }
    }

    ngOnInit(): void {

        this._listafornecedorservice.getData();

        // Get the data
        this._listafornecedorservice.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.fornecedoresObjects = data;

                if(this.fornecedoresObjects){

                    this.fornecedoresObjects = data;
                    this.fornecedoresStringList = this.fornecedoresObjects.map(
                        (item) => item.string
                    );

                    this.filteredFornecedoresObjects = this.fornecedoresObjects;
                    this.filteredFornecedoresStringList = this.fornecedoresStringList;

                    this._cdr.markForCheck();

                }

            });

    }

}
