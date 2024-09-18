import { Injectable } from "@angular/core";
import { enviroment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";

@Injectable({
    providedIn:'root'
})

export class CategoryService {
    private apiGetCategories = `${enviroment.apiBaseUrl}/categories`
    constructor(private http: HttpClient){

    }

    getCategories(page: number, limit: number):Observable<Category[]> {
        const params = new HttpParams()
            .set('page', page)
            .set('limit', limit)
        return this.http.get<Category[]>(this.apiGetCategories, {params})
        
    }
}

