import {
    IsString,
    IsNotEmpty,
    isPhoneNumber,
    isDate,
    IsDate,
    IsPhoneNumber,
    IsNumber,
    IsArray
} from 'class-validator'


export class OrderDTO {
    @IsNumber()
    user_id: number;

    @IsString()
    fullname: string;

    @IsString()
    email: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsString()
    address: string;

    @IsString()
    note: string;

    @IsNumber()
    total_money: number;

    @IsString()
    payment_method: string;


    @IsString()
    shipping_method: string;

    @IsString()
    coupon_code: string;

    @IsArray()
    cart_items: [];

    constructor(data: any){
        this.user_id = data.user_id
        this.fullname = data.fullname
        this.email = data.emai
        this.phone_number = data.phone_number
        this.address = data.address
        this.note = data.note
        this.total_money = data.total_money
        this.payment_method = data.payment_method
        this.shipping_method = data.shipping_method
        this.coupon_code = data.coupon_code
        this.cart_items = data.cart_items
    }







}