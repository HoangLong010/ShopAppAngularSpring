export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    thumbnail: string; // Đảm bảo rằng thuộc tính này tồn tại
    category_id: number
    url: string;
}