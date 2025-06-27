package com.example.e_commerce.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_commerce.model.Product;
import com.example.e_commerce.model.User;
import com.example.e_commerce.service.ProductService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> listAll() {
        return productService.viewAllProducts();
    }

    @GetMapping("/search")
    public List<Product> serachByKeyword(@RequestParam("keyword") String keyword) {
        return productService.serachByName(keyword);
    }
    

    @GetMapping("/{productId}")
    public Optional<Product> viewProduct(@PathVariable("productId") Long productId) {
        return productService.viewByID(productId);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product, HttpSession session) {
        User user = (User) session.getAttribute("user");
        return productService.addProduct(product, user);
    }

    @PutMapping("/{productId}")
    public Product editProduct(@PathVariable("productId") Long productId, @RequestBody Product product,
            HttpSession session) {
        User user = (User) session.getAttribute("user");
        return productService.editProductById(product, productId, user);
    }

    @DeleteMapping("/{productId}")
    public String deleteProduct(@PathVariable("productId") Long productId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        return productService.deleteById(productId, user);
    }

}
