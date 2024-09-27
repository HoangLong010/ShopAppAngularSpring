import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { enviroment } from '../../environments/environment';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss'
})
export class OrderConfirmComponent implements OnInit{
  cartItems: { product: Product, quantity: number}[] = [];
  couponCode: string = '' // Mã giảm giá
  totalAmount: number = 0

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ){}


  ngOnInit(): void {
      // Lấy danh sách sản phẩm từ giỏ hàng
      debugger
      const cart = this.cartService.getCart();
      const productIds = Array.from(cart.keys()) // Chuyển danh sách ID từ Map giỏ hàng

      // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
      debugger
      this.productService.getProductsByIds(productIds).subscribe({
        next: (products) => {
          debugger
          // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
          this.cartItems = productIds.map((productId) => {
            debugger
            const product = products.find((p) => p.id === productId)
            if(product){
              product.thumbnail = `${enviroment.apiBaseUrl}/products/images/${product.thumbnail}`
            }
            return {
              product: product!,
              quantity:cart.get(productId)!
            }
          }) 
        },
        complete:() => {
          debugger
          this.calculateTotal()
        },
        error: (error: any) => {
          debugger
          console.error('Error fetching detail:', error);
          
        }
      })

  }


  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    )
  }


  // Hàm xử lý mã giảm giá
  applyCoupon() : void {

  }
}
