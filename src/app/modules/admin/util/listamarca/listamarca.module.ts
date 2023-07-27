import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgFor} from '@angular/common';

import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { ListamarcaComponent } from './listamarca.component';

@NgModule({
  declarations: [ListamarcaComponent],
  imports: [
    CommonModule, NgFor
    ,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule
    ,MatSelectModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
],
exports: [ListamarcaComponent]
})
export class ListamarcaModule { }
