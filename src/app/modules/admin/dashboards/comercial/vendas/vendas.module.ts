import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendasDashComponent } from './vendas.component';
import { vendasDashRoutes } from './vendas.routing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [VendasDashComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(vendasDashRoutes),
        MatSlideToggleModule,
        MatIconModule,
        FormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class VendasDashModule {}
