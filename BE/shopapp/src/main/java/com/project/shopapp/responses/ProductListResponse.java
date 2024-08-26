package com.project.shopapp.responses;
import java.util.List;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductListResponse {
    private List<ProductResponse> products;
    private int totalPages;

}
