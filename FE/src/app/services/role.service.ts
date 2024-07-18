import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "../environments/environment";

@Injectable({
    providedIn:'root'
})
export class RoleService {
    
    private apiGetRoles = `${enviroment.apiBaseUrl}/roles`

    constructor(private http: HttpClient){  

    }
    
    getRoles():Observable<any>{
        debugger
        return this.http.get<any[]>(this.apiGetRoles)
    }
}