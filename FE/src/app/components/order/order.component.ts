import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { enviroment } from '../../environments/environment';
import { OrderDTO } from '../../dtos/user/order.dto';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = []
  couponCode: string = ''
  totalAmount: number = 0
  orderData: OrderDTO = {
    user_id: 1,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []

  }

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService
  ) {

  }

  ngOnInit(): void {
    debugger
    const cart = this.cartService.getCart()
    const productIds = Array.from(cart.keys())

    debugger
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId)
          if (product) {
            product.thumbnail = `${enviroment.apiBaseUrl}/products/images/${product.thumbnail}`
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          }
        })
      },
      complete: () => {
        debugger
        // this.calculateTotal()
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching detail:', error)
      }
    })
  }

  placeOrder() {
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (response) => {
        debugger
        console.log('Đặt hàng thành công');

      },
      complete: () => {
        debugger
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger
        console.error('Lỗi khi đặt hàng: ', error);
      }
    }
    )
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    )
  }





}
