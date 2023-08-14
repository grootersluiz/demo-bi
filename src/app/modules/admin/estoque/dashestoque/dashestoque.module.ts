import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
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
import { NgApexchartsModule } from "ng-apexcharts";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectfilialModule } from '../../util/selectfilial/selectfilial.module';
import { DashestoqueComponent } from './dashestoque.component';
import { dashEstoqueRoutes } from './dashestoque.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListamarcaModule } from '../../util/listamarca/listamarca.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { ColorsComponent } from '../../util/colors/colors.component';
import { ListafornecedorModule } from '../../util/listafornecedor/listafornecedor.module';
import { ListacurvaModule } from '../../util/listacurva/listacurva.module';




@NgModule({
    declarations: [DashestoqueComponent],
    imports: [
        RouterModule.forChild(dashEstoqueRoutes),
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
        ReactiveFormsModule,
        SelectfilialModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        ListamarcaModule,
        MatMenuModule,
        MatAutocompleteModule,
        ListafornecedorModule,
        ListacurvaModule




    ],

    providers:[ColorsComponent]
})
export class DashEstoqueModule {}


