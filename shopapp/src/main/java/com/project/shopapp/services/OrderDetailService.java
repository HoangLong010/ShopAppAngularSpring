package com.project.shopapp.services;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Service;

import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.Product;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService{
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    

    // Thêm orderDetail
    @Override
    public OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception {
        // Kiểm tra đơn order xem tồn tại không
        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
        .orElseThrow(() -> new DataNotFoundException("Cannot find Order with id: " + orderDetailDTO.getOrderId() ));

        // Kiểm tra sản phẩm mua có tồn tại không
        Product product = productRepository.findById(orderDetailDTO.getProductId())
        .orElseThrow(() -> new DataNotFoundException("Cannot find Product with id: " + orderDetailDTO.getProductId()));
        
        OrderDetail orderDetail = OrderDetail.builder()
        .order(order)
        .product(product)
        .price((float)product.getPrice())
        .numberOfProducts(orderDetailDTO.getNumberOfProducts())
        .totalMoney((float)product.getPrice() * orderDetailDTO.getNumberOfProducts())
        .color(orderDetailDTO.getColor())
        .build();   

        return orderDetailRepository.save(orderDetail);
    }

    // Lấy ra chi tiết 1 orderDetail
    @Override
    public OrderDetail getOrderDetail(Long id) throws Exception{
        return orderDetailRepository.findById(id).orElseThrow(
            () -> new DataNotFoundException("Cannot find OrderDetail with id: " + id)
        );
    }

    // Cập nhật 
    @Override
    public OrderDetail updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) throws DataNotFoundException{
        // Tìm xem orderdetail có tồn tại hay không
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Cannot find order detail with id: " + id));
        // Tìm xem order có tồn tại không
        Order existingOrder = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find order with id: " + orderDetailDTO.getOrderId()));
        // Tìm xem product có tồn tại không
        Product existingProduct = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find Product with id: " + orderDetailDTO.getProductId()));
        existingOrderDetail.setPrice(orderDetailDTO.getPrice());
        existingOrderDetail.setNumberOfProducts(orderDetailDTO.getNumberOfProducts());
        existingOrderDetail.setTotalMoney(orderDetailDTO.getTotalMoney());
        existingOrderDetail.setColor(orderDetailDTO.getColor());
        existingOrderDetail.setOrder(existingOrder);
        existingOrderDetail.setProduct(existingProduct);
        return orderDetailRepository.save(existingOrderDetail);
    }

    // Delete
    @Override
    public void deleteById(Long id) {
        orderDetailRepository.deleteById(id);   
    }

    // lấy ra 1 list orderDetail từ 1 order
    @Override
    public List<OrderDetail> findByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }
    
    




}
