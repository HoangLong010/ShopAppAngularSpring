import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { enviroment } from '../../environments/environment';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  products: Product[] = []
  categories: Category[] = []
  selectedCategoryId: number = 0
  currentPage: number = 1
  itemsPerPage: number = 12
  pages: number[] = []
  totalPages: number = 0
  visiblePages: number[] = []
  keyword: string = ""



  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ){
  
    
  }
  ngOnInit(){
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage)
    this.getCategories(1,100)
  }


  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 12;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  } 

  getCategories(page:number, limit:number){
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    })
  }



  
  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number ){
    debugger
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger
        response.products.forEach((product: Product) => {
          product.url = `${enviroment.apiBaseUrl}/products/images/${product.thumbnail}`
        })
        this.products = response.products
        this.totalPages = response.totalPages
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages)
       
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching products: ', error);
        
      }
    })
  }
  

  onPageChange(page: number){
    debugger
    this.currentPage = page
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage)
  }


  generateVisiblePageArray(currentPage: number, totalPage: number): number[] {
    debugger
    const maxVisiblePages = 5
    const halfVisiblePages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(currentPage - halfVisiblePages, 1)
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPage)

    if(endPage - startPage + 1 < maxVisiblePages){
      startPage = Math.max(endPage - maxVisiblePages + 1, 1)
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index)
  }

  onProductClick(productId: number){
    debugger
    this.router.navigate(['/product', productId])
  }



}
