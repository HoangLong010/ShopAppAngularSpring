package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.BaseEntity;
import com.project.shopapp.models.Product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse extends BaseEntity {
    private String name;

    private Float price;

    private String thumbnail;

    private String description;

    @JsonProperty("category_id")
    private Long categoryId;

    // Tạo 1 đối tượng ProductResponse từ đối tượng Product
    public static ProductResponse formProduct(Product product){
        ProductResponse productResponse = ProductResponse.builder()
            .name(product.getName())
            .price(product.getPrice())
            .description(product.getDescription())
            .thumbnail(product.getThumbnail())
            .categoryId(product.getCategory().getId())
            .build();
            productResponse.setCreatedAt(product.getCreatedAt());
            productResponse.setUpdatedAt(product.getUpdatedAt());
    return productResponse;    

}

}
