package com.example.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_commerce.model.CartItem;
import com.example.e_commerce.model.User;
import com.example.e_commerce.service.CartService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/cart")

public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add/{productId}")
    public String addToCart(@PathVariable("productId") Long productId, @RequestParam(name = "quantity") int quantity, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("Please log in first.");
        }
        return cartService.addToCart(user.getUserId(), productId, quantity);
    }

    @GetMapping
    public List<CartItem> viewCart(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("Please log in first.");
        }
        return cartService.viewCart(user.getUserId());
    }

    @PostMapping("/update/{productId}")
    public String updateQuantity(@PathVariable("productId") Long productId,
            @RequestParam("change") int change,
            HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null)
            return "Login required.";

        return cartService.updateQuantity(user.getUserId(), productId, change);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public String removeItem(@PathVariable("cartItemId") Long cartItemId) {
       return cartService.removeCart(cartItemId);
    }

   
}
