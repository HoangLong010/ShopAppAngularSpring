import { Injectable } from "@angular/core";
import { enviroment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { OrderDetail } from "../models/order.detail";
import { OrderDTO } from "../dtos/user/order.dto";
import { Observable } from "rxjs";
import { OrderResponse } from "../responses/user/order.response";
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiOrder = `${enviroment.apiBaseUrl}/orders`
    constructor(private http: HttpClient){

    }
  
    getOrderById(orderId: number){
        return this.http.get<OrderDetail>(`${this.apiOrder}/${orderId}`)
    }

    placeOrder(orderData: any): Observable<any> {
      return this.http.post(this.apiOrder, orderData);
    }
      
    
}