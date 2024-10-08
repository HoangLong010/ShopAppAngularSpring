package com.project.shopapp.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.models.*;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.aspectj.weaver.ast.Or;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    
    @Override
    public Order createdOrder(OrderDTO orderDTO) throws Exception {
        // Tìm usedId có tồn tại hay không
        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: "+ orderDTO.getUserId()) );
        // Tạo một luồng dữ liệu ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        // Cập nhật các trường của đơn hàng từ orderDTO
        Order order = new Order();
        modelMapper.map(orderDTO, order);
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);

        // Kiểm tra shipping date phải >= ngày hôm nay
        LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now() : orderDTO.getShippingDate(); 
        if(shippingDate.isBefore(LocalDate.now())){
            throw new DataNotFoundException("Data must be at least today !");
        }
        order.setShippingDate(shippingDate);
        order.setActive(true);
        order.setTotalMoney(orderDTO.getTotalMoney());
        orderRepository.save(order);

        // Tạo danh sách đối tượng OrderDetail từ CartItemDTO
        List<OrderDetail> orderDetails = new ArrayList<>();
        for(CartItemDTO cartItemDTO: orderDTO.getCartItems()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            // Lấy thông tin sẳn phẩm
            Long productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity();

            Product product =  productRepository.findById(productId)
                    .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));
            orderDetail.setProduct(product);
            orderDetail.setNumberOfProducts(quantity);

            orderDetail.setPrice(product.getPrice());

            orderDetails.add(orderDetail);
        }

        orderDetailRepository.saveAll(orderDetails);
        return order;
    }

    @Override
    public Order getOrder(long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() -> 
            new DataNotFoundException("Cannot find order with id: "+ id));
        User existingUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(() -> 
            new DataNotFoundException("Cannot find user with id: "+ id));

        modelMapper.typeMap(OrderDTO.class, Order.class)
            .addMappings(mapper -> mapper.skip(Order::setId));
        
        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        // Không xoá cúng hãy xoá mềm
        if(order != null){
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
        
    }

}
