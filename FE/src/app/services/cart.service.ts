import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private cart: Map<number, number> = new Map();
    
    constructor(private productService: ProductService) {
        // Lấy dữ liệu từ giỏ hàng từ localStorage khi khởi tạo service
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
            this.cart = new Map(JSON.parse(storedCart))
        }
    }

    addToCart(productId: number, quantity: number = 1): void {
        debugger
        if (this.cart.has(productId)) {
            // nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên
            this.cart.set(productId, this.cart.get(productId)! + quantity)
        } else {
             // nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng
            this.cart.set(productId, quantity)
        }

        // Sau khi thay đổi, lưu trữ vào localStorage
        this.saveCartToLocalStorage();
    }

    getCart(): Map<number, number> {
        return this.cart
    }
    private saveCartToLocalStorage() : void {
        debugger
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())))
    }

    clearCart(): void {
        this.cart.clear()
        this.saveCartToLocalStorage()
    }
}


