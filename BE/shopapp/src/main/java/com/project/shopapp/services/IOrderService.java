package com.project.shopapp.services;

import java.util.List;

import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;

public interface IOrderService {
    Order createdOrder(OrderDTO orderDTO) throws Exception; 

    Order getOrder(long id);

    Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException;

    void deleteOrder(Long id);
    
    List<Order> findByUserId(Long userId);
}
