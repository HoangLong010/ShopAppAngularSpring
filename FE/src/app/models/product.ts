import { ProductImage } from "./product.image";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    thumbnail: string; 
    category_id: number;
    url: string;
    product_images: ProductImage[];
    
}