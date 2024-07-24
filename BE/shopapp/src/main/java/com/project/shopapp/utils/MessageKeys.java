package com.project.shopapp.utils;

import org.springframework.stereotype.Component;

@Component
public class MessageKeys {
    public static final String LOGIN_SUCCESSFULLY = "user.login.login_successfully";

    public static final String REGISTER_SUCCESSFULLY = "user.login.register_successfully";

    public static final String REGISTER_FAILED = "user.login.register_failed";

    public static final String LOGIN_FAILED = "user.login.login_failed";

    public static final String PASSWORD_NOT_MATCH = "user.register.password_not_match";

    public static final String CREATE_CATEGORY_SUCCESSFULLY = "category.create_category.create_successfully";

    public static final String DELETE_CATEGORY_SUCCESSFULLY = "category.delete_category.delete_successfully";

    public static final String UPDATE_CATEGORY_SUCCESSFULLY = "category.update_category.update_successfully";

    public static final String CREATE_CATEGORY_FAILED = "category.create_category.create_failed";

    public static final String DELETE_ORDER_SUCCESSFULLY = "order.delete_order.delete_successfully";

    public static final String DELETE_ORDER_DETAIL_SUCCESSFULLY = "order.delete_order.detail.delete_successfully";

    public static final String UPLOAD_IMAGES_MAX_5= "product.upload_images.error_max_5_images";

    public static final String UPLOAD_IMAGES_FILE_LARGE= "product.upload_images.file.large";

    public static final String UPLOAD_IMAGES_FILE_MUST_BE_IMAGE= "product.upload_images.file_must_be_image";

    public static final String ROLE_DOES_NOT_EXISTS = "user.login.role_not_exists";

    public static final String WRONG_PHONE_PASSWORD = "user.login.wrong_phone_password";



}
