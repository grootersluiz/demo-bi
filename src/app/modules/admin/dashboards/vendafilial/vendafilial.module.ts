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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
 import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { VendafilialComponent } from 'app/modules/admin/dashboards/vendafilial/vendafilial.component';
import { vendafilialRoutes } from 'app/modules/admin/dashboards/vendafilial/vendafilial.routing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// registerLocaleData(ptBr);
registerLocaleData(localePt);


@NgModule({
    declarations: [VendafilialComponent],
    imports: [
        // VendafilialchartModule,
        RouterModule.forChild(vendafilialRoutes),
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        NgApexchartsModule,
        MatSlideToggleModule,
        ReactiveFormsModule
    ],
    // exports: [VendafilialchartComponent],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        // {
        //     provide: LOCALE_ID,
        //     useValue: 'pt',
        // },
        // {
        //     provide: DEFAULT_CURRENCY_CODE,
        //     useValue: 'BRL',
        // }
    ]
})
export class VendafilialModule {}
