import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { enviroment } from '../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute // Sử dụng ActivatedRoute để lấy id từ URL
  ) {}

  ngOnInit() {
    // Lấy productId từ URL khi component được khởi tạo
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id'); // Lấy giá trị 'id' từ URL
      debugger
      if (idParam) {
        this.productId = +idParam;
        this.loadProductDetail(); // Gọi hàm để tải chi tiết sản phẩm
      } else {
        console.error('ID sản phẩm không hợp lệ');
      }
    });
  }

  loadProductDetail() {
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${enviroment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          this.product = response;
          this.showImage(0); // Hiển thị hình ảnh đầu tiên
        },
        error: (error: any) => {
          console.error('Error fetching detail: ', error);
        }
      });
    }
  }

  showImage(index: number): void {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      index = Math.max(0, Math.min(index, this.product.product_images.length - 1));
    }
    this.currentImageIndex = index;
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }
  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      console.error("Không thể thêm sản phẩm vào giỏ hàng vì product là null.");
    }
  }

  increaseQuantily(): void {
    this.quantity++;
  }

  decreaseQuantily(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    // Logic xử lý cho nút "Mua ngay"
  }
}
