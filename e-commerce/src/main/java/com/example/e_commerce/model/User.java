package com.example.e_commerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long userId;

    @NotBlank(message="Name is required")
    private String name;

    @Column(unique = true)
    @Email(message="Enter valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min=5,max=8,message="Password must be at least 5 characters")
    private String password;

    @Column(nullable = false)
    private String role;


   
}
