package com.example.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.e_commerce.model.Product;

@Repository
public  interface ProductRepository extends JpaRepository<Product,Long>{
    List<Product> findByNameContainingIgnoreCase(String name);

}
