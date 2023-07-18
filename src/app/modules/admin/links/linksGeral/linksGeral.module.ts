import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { LinksGeralComponent } from './linksGeral.component';
import { RouterModule } from '@angular/router';
import { linksGeralRoutes } from './linksGeral.routing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [LinksGeralComponent],
    imports: [
        MatChipsModule,
        MatGridListModule,
        MatCardModule,
        CommonModule,
        RouterModule.forChild(linksGeralRoutes),
    ],
})
export class LinksGeralModule {}
