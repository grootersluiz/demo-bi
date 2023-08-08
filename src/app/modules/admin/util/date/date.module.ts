import { NgModule } from '@angular/core';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { dateComponent } from './date.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [dateComponent],
  imports: [
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [dateComponent]
})
export class dateModule { }
