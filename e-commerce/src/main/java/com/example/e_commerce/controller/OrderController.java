package com.example.e_commerce.controller;


import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.e_commerce.model.InvoiceGenerator;
import com.example.e_commerce.model.Order;
import com.example.e_commerce.model.User;
import com.example.e_commerce.service.OrderService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public String placeOrder(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "You must be logged in to place an order.";
        }
        return orderService.placeOrder(user.getUserId());
    }

    @GetMapping("/my-orders")
   public List<Order> getUserOrders(HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
        throw new RuntimeException("Please login first.");
    }
    return orderService.getOrdersByuserId(user.getUserId());
}

@GetMapping("/{orderId}")
public void downloadInvoice(@PathVariable("orderId") Long orderId, HttpServletResponse response) {
    try {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Order not found");
            return;
        }

        // Write PDF to memory first
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        InvoiceGenerator.generateInvoice(baos, order);
        byte[] pdfBytes = baos.toByteArray();

        // Set headers
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=invoice_" + orderId + ".pdf");
        response.setContentLength(pdfBytes.length);

        // Send the PDF
        OutputStream out = response.getOutputStream();
        out.write(pdfBytes);
        out.flush();

    } catch (Exception e) {
        e.printStackTrace(); // Show exact error
        try {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error generating invoice: " + e.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}

}
