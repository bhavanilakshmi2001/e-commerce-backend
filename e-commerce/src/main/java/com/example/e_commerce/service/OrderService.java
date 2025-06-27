package com.example.e_commerce.service;

import java.math.BigDecimal;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_commerce.model.CartItem;
import com.example.e_commerce.model.Order;
import com.example.e_commerce.model.OrderItem;
import com.example.e_commerce.model.User;
import com.example.e_commerce.repository.CartItemRepository;
import com.example.e_commerce.repository.OrderITemRepository;
import com.example.e_commerce.repository.OrderRepository;
import com.example.e_commerce.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderITemRepository orderItemRepository;


  @Transactional
        public String placeOrder(Long userId) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<CartItem> cartItems = cartItemRepository.findByUser(user);
            if (cartItems.isEmpty()) {
                return "Cart is empty. Cannot place order.";
            }

            Order order = new Order();
            order.setUser(user);

            BigDecimal totalAmount = BigDecimal.ZERO;
            for (CartItem cartItem : cartItems) {
                totalAmount = totalAmount.add(cartItem.getTotalPrice());
            }

            order.setTotalAmount(totalAmount);
            order = orderRepository.save(order); // Save order first

            for (CartItem cartItem : cartItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getProduct().getPrice());
                orderItemRepository.save(orderItem);
            }

            cartItemRepository.deleteAll(cartItems);

            return "Order placed successfully!";
        }

        public List<Order> getOrdersByuserId(Long userId) {
            return orderRepository.findByUserUserId(userId);
        }
        
        public Order getOrderById(Long id) {
            return orderRepository.findById(id).orElse(null);
        }
    }


