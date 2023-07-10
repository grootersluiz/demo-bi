import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { MAT_DATE_LOCALE} from '@angular/material/core';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import {FormControl} from "@angular/forms";

import { NgApexchartsModule } from "ng-apexcharts";

import { AnalisemarcaComponent } from 'app/modules/admin/dashboards/analisemarca/analisemarca.component';
import { analisemarcaRoutes } from 'app/modules/admin/dashboards/analisemarca/analisemarca.routing';

registerLocaleData(localePt);

@NgModule({
    declarations: [AnalisemarcaComponent],
    imports: [
        RouterModule.forChild(analisemarcaRoutes),
        CommonModule,
        MatToolbarModule,
        MatTooltipModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        NgApexchartsModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: LOCALE_ID, useValue: 'pt-BR' }
    ]
})
export class AnalisemarcaModule {}
