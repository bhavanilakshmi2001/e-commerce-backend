package com.example.e_commerce.model;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

public class InvoiceGenerator {

    public static void generateInvoice(OutputStream out, Order order) throws Exception {
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();

        document.add(new Paragraph("Apple Store"));
        document.add(new Paragraph("Date: " + LocalDate.now()));
        document.add(new Paragraph("Customer: " + order.getUser().getName()));
        document.add(new Paragraph(" ")); // Spacer

        PdfPTable table = new PdfPTable(4);
        table.addCell("Product Name");
        table.addCell("Price");
        table.addCell("Quantity");
        table.addCell("Total");

        for (OrderItem item : order.getOrderItems()) {
            table.addCell(item.getProduct().getName());
            table.addCell(String.format("$%.2f", item.getPrice().doubleValue()));
            table.addCell(String.valueOf(item.getQuantity()));
            BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            table.addCell(String.format("$%.2f", total.doubleValue()));
        }

        document.add(table);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total Amount: $" + String.format("%.2f", order.getTotalAmount().doubleValue())));
        document.close();
        System.out.println("Generating PDF for order: " + order.getOrderId());
  
System.out.println("Customer: " + order.getUser().getName());
System.out.println("Items count: " + order.getOrderItems().size());


    }
}
