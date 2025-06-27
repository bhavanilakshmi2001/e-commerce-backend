package com.example.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.e_commerce.model.Order;
import com.example.e_commerce.model.OrderItem;

@Repository
public interface OrderITemRepository extends JpaRepository<OrderItem,Long>{
    List<OrderItem> findByOrder(Order order);
}
