package com.example.e_commerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.e_commerce.model.User;
import com.example.e_commerce.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final String ADMIN_KEY = "admin123";

    // Register
    public String register(User user, String adminKey) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return "Email Already Registered...";
        }

        if (adminKey != null && adminKey.equals(ADMIN_KEY)) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        userRepository.save(user);
        return "Registered Successfully as " + user.getRole();
    }

    // Login
    public String login(User user, HttpSession session) {
        User exists = userRepository.findByEmail(user.getEmail());
        if (exists != null && exists.getPassword().equals(user.getPassword())) {
            session.setAttribute("user", exists);
            return "Login Successfully...";
        }
        return "Invalid email or password...";
    }

    // Logout
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logout Successfully..";
    }

    public User getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("User not logged in");
        }
        // Optional: Reload from DB if you want the latest info
        return userRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
