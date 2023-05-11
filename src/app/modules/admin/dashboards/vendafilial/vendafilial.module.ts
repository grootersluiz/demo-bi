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
import { MatNativeDateModule } from '@angular/material/core';
// import {FormControl} from "@angular/forms";

import { NgApexchartsModule } from "ng-apexcharts";

import { VendafilialComponent } from 'app/modules/admin/dashboards/vendafilial/vendafilial.component';
import { vendafilialRoutes } from 'app/modules/admin/dashboards/vendafilial/vendafilial.routing';

registerLocaleData(ptBr);

@NgModule({
    declarations: [VendafilialComponent],
    imports: [
        // VendafilialchartModule,
        RouterModule.forChild(vendafilialRoutes),
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
        NgApexchartsModule
    ],
    // exports: [VendafilialchartComponent],
    providers: [
        // VendafilialchartModule,
        // VendafilialchartService,
        {
            provide: LOCALE_ID,
            useValue: 'pt',
        },
        {
            provide: DEFAULT_CURRENCY_CODE,
            useValue: 'BRL',
        }
    ]
})
export class VendafilialModule {}
