import { Product } from "../../models/product"

export interface OrderResponse {
    id: number,
    user_id: number,
    fullname: string,
    email: string,
    phone_number: number,
    address: string,
    note: string,
    order_date: Date,
    total_money: number
    shipping_method: string,
    shipping_address: string,
    shipping_date: Date,
    payment_method: string,
    status: string,
    order_details: Product[]
}