import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendafilialComponent } from 'app/modules/admin/dashboards/vendafilial/vendafilial.component';
import { vendafilialRoutes } from 'app/modules/admin/dashboards/vendafilial/vendafilial.routing';
import { MAT_DATE_LOCALE} from '@angular/material/core';
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

@NgModule({
    declarations: [VendafilialComponent],
    imports: [
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
        // FormControl
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class VendafilialModule {}
