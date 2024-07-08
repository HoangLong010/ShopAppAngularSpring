package com.project.shopapp.controllers;

import com.project.shopapp.dtos.CategoryDTO;
import com.project.shopapp.models.Category;
import com.project.shopapp.responses.UpdateCategoryResponse;
import com.project.shopapp.services.CategoryService;
import com.project.shopapp.component.LocalizationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/${api.prefix}/categories")
//@Validated

@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")
    // Nếu tham số truyển vào là 1 object thì sao ?
    public ResponseEntity<?> createCategory(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result){
        if(result.hasErrors()){
            List<String> errorsMessages =result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage).toList();
            return ResponseEntity.badRequest().body(errorsMessages);
        }

        categoryService.createCategory(categoryDTO);

        return ResponseEntity.ok("Insert Category Successfully");
    }
    // Hiển thị tất cả các categories
    @GetMapping("")
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ){
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateCategoryResponse> updateCategories(
            @PathVariable Long id,
            @RequestBody CategoryDTO categoryDTO
            )
    {
        categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(UpdateCategoryResponse.builder()
                        .message(localizationUtils.getLocalizedMessage("category.update_category.update_successfully"))
                .build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategories(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Delete category with id: " + id +" successfully");
    }




}
