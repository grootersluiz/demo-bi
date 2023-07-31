import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { tipovendaComponent } from './tipovenda.component';
import { RouterModule } from '@angular/router';
import { tipovendaRoutes } from './tipovenda.routing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
// import { MAT_DATE_LOCALE} from '@angular/material/core';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectfilialModule } from '../../util/selectfilial/selectfilial.module';
@NgModule({
    declarations: [tipovendaComponent],
    imports: [
        RouterModule.forChild(tipovendaRoutes),
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTableModule,
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
        ReactiveFormsModule,
        SelectfilialModule,
    ],
})
export class tipovendaModule {}
