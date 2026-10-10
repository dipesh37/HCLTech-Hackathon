package com.shopsmart.order;

public enum OrderStatus {
    PLACED,         // Customer just placed it
    PROCESSING,     // Warehouse is picking/packing
    SHIPPED,        // Out for delivery
    DELIVERED,      // Delivered
    CANCELLED       // Cancelled
}
