import { Router } from "@angular/router";
import { OrderResponse } from "../../responses/user/order.response";
import { TokenService } from "../../services/token.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrderService } from "../../services/order.service";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { OrderDTO } from "../../dtos/user/order.dto";
import { Component, OnInit } from "@angular/core";
import { Product } from "../../models/product";


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;

  orderData: OrderDTO = {
    user_id: 3, 
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    cart_items: [],
    coupon_code: ""
  };
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {

    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    if (productIds.length === 0) return;

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: any) => {
        console.error('Lỗi khi lấy thông tin chi tiết:', error);
      }
    });
  }

  placeOrder() {

    this.orderData.user_id = this.tokenService.getUserId();
    debugger
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
        cart_items: this.cartItems.map(cartItem => ({
          product_id: cartItem.product.id,
          quantity: cartItem.quantity
        })),
        total_money: this.totalAmount
      };

      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: OrderResponse) => {
          debugger
          alert("Đặt hàng thành công")
          this.cartService.clearCart();
          this.router.navigate(['/', response.id]);
        },
        complete: () => {
          debugger
          this.calculateTotal()
        },
        error: (error: any) => {
          debugger
          alert(`Lỗi khi đặt hàng: ${error}`)
        }
      });
    
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    );
  }
}
