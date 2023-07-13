import { NgModule, forwardRef, EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {FormControl} from "@angular/forms";
import {MatCheckboxModule} from '@angular/material/checkbox';

import { NgApexchartsModule } from "ng-apexcharts";

import { AnalisemarcaComponent, AnalisemarcaDialogComponent } from 'app/modules/admin/dashboards/analisemarca/analisemarca.component';
import { analisemarcaRoutes } from 'app/modules/admin/dashboards/analisemarca/analisemarca.routing';

registerLocaleData(localePt);

@NgModule({
    declarations: [AnalisemarcaComponent, AnalisemarcaDialogComponent],
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
        FormsModule, MatButtonModule,
        MatDialogModule, MatInputModule, FormsModule, MatButtonModule, NgIf, MatCheckboxModule,
        NgApexchartsModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: MatDialogRef,useValue: [AnalisemarcaDialogComponent] },
        { provide: MAT_DIALOG_DATA, useValue: [] }
    ],
    entryComponents: [
        AnalisemarcaDialogComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AnalisemarcaModule {}
