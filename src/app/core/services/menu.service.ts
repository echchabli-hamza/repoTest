import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Dish } from '../models/dish.model';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor() { }

    getDishes(): Observable<Dish[]> {
        // TODO: Implement API call
        return of([]);
    }

    getDishById(id: string): Observable<Dish | undefined> {
        // TODO: Implement API call
        return of(undefined);
    }

    getDishesByCategory(category: string): Observable<Dish[]> {
        // TODO: Implement API call
        return of([]);
    }
}
