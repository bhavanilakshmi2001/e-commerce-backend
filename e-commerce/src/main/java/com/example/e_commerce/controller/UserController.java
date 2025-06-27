package com.example.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.e_commerce.model.User;
import com.example.e_commerce.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;

    // register 
    @PostMapping("/register")
    public String register(@RequestBody @Valid User user,
            @RequestParam(name = "adminKey", required = false) String adminKey) {
        return userService.register(user, adminKey);
    }
    
    @GetMapping("/currentUser") // you can change this name
    public User getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("Not logged in");
        }
        return user;
    }

     //login
    @PostMapping("/login")
    public String login(@RequestBody User user,HttpSession session) {
        return userService.login(user, session);
    } 

    // logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        return userService.logout(session);
    }

    @GetMapping("/me")
    public User viewProfile(HttpSession session) {
        User currentUser = userService.getCurrentUser(session);
        return currentUser;
    }


}
