package com.project.shopapp.models;

public class OrderStatus {
    public static final String PENDING = "pending"; // Chưa giải quyết
    public static final String PROCESSING = "processing"; // Xử lý
    public static final String SHIPPED = "shipped"; // Đã vận chuyển
    public static final String DELIVERED = "delivered"; // Đã giao hàng
    public static final String CANCELLED = "cancelled"; // Đã huỷ
}
