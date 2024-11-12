import { Product } from "./product";

export interface OrderDetail {
   id: number,
   product: Product,
   price: number,
   total_money: number,
   color: number

}