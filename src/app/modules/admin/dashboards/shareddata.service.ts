import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedDataService {
    dashID: number;

    setDashID(id: number) {
        this.dashID = id;
    }

    getDashID(): number {
        return this.dashID;
    }
}
