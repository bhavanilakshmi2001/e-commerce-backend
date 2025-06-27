package com.example.e_commerce.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_commerce.model.CartItem;
import com.example.e_commerce.model.Product;
import com.example.e_commerce.model.User;
import com.example.e_commerce.repository.CartItemRepository;
import com.example.e_commerce.repository.ProductRepository;
import com.example.e_commerce.repository.UserRepository;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public String addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("UserID not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("ProductID not found"));
       
        Optional<CartItem> existing=cartRepository.findByUserAndProduct(user, product);
        if(existing.isPresent()){
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            cartRepository.save(item);

     } else {
         CartItem item = new CartItem();
         item.setUser(user);
         item.setProduct(product);
         item.setQuantity(quantity);
         item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
         cartRepository.save(item);
      }

     return "Added to cart";
    }

    public List<CartItem> viewCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("UserID not found"));
         return cartRepository.findByUser(user);
        }


     public String removeCart(Long cartId) {
           Optional<CartItem> cart = cartRepository.findById(cartId); 
            if (cart.isPresent()) {
                cartRepository.deleteById(cartId);
                return "ITem removed from cart";
            }
           throw new RuntimeException("cartID not found");
        }
   
        public String updateQuantity(Long userId, Long productId, int change) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("UserID not found"));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("ProductID not found"));

            Optional<CartItem> optionalItem = cartRepository.findByUserAndProduct(user, product);
            if (optionalItem.isEmpty())
                return "Item not in cart.";

            CartItem item = optionalItem.get();
            int newQty = item.getQuantity() + change;
            if (newQty <= 0) {
                cartRepository.delete(item);
                return "Item removed from cart.";
            }

            item.setQuantity(newQty);
            item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(newQty)));
            cartRepository.save(item);

            return "Cart updated.";
        }

        


}
