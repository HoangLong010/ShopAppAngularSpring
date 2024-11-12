import { Category } from "./category";
import { ProductImage } from "./product.image";

export interface Product {
    product: any;
    id: number;
    name: string;
    description: string;
    price: number;
    thumbnail: string; 
    category_id: Category;
    url: string;
    product_images: ProductImage[];
    number_of_products: number;
    total_money: number
    
}