import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { LinksTIComponent } from './linksTI.component';
import { RouterModule } from '@angular/router';
import { linksTIRoutes } from './linksTI.routing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [LinksTIComponent],
    imports: [
        MatChipsModule,
        MatGridListModule,
        MatCardModule,
        CommonModule,
        RouterModule.forChild(linksTIRoutes),
    ],
})
export class LinksTIModule {}
