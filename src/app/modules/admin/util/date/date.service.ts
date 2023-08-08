import { dateComponent } from './date.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class dateService {
    readonly INITIAL_INITIAL_DATE = this.getCurrentDate();
    readonly INITIAL_FINAL_DATE = this.getCurrentDate();
    getCurrentDate() {
        let date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        };
    }
}
