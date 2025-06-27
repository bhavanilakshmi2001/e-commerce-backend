package com.example.e_commerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_commerce.model.Product;
import com.example.e_commerce.model.User;
import com.example.e_commerce.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    
    public List<Product> viewAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> viewByID(Long productId) {
        return productRepository.findById(productId);
    }

    public List<Product> serachByName(String keyword){
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product addProduct(Product product, User user) {
    if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
      throw new RuntimeException("Only admin can add products.");
    }
    return productRepository.save(product);
}

   public Product editProductById(Product product, Long productId, User user) {
    if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
        throw new RuntimeException("Only admin can edit products.");
    }

    Optional<Product> exist = productRepository.findById(productId);
    if (exist.isPresent()) {
        Product updated = exist.get();
        updated.setName(product.getName());
        updated.setPrice(product.getPrice());
        updated.setQuantity(product.getQuantity());
        updated.setDescription(product.getDescription());
        updated.setImageUrl(product.getImageUrl());
        return productRepository.save(updated);
    }
    return null;
}

    
   public String deleteById(Long productId, User user) {
    if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
        throw new RuntimeException("Only admin can delete products.");
    }
    productRepository.deleteById(productId);
    return "Product item deleted Successfully..";
}
    
}
