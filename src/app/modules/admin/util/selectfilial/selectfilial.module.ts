import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectfilialComponent } from './selectfilial.component';

import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);


@NgModule({
  declarations: [SelectfilialComponent],
  imports: [
    CommonModule
    , ReactiveFormsModule
    ,MatFormFieldModule, MatSelectModule, NgFor, MatInputModule, FormsModule
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class SelectfilialModule { }
