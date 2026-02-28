package com.example.Car_Servicing_Backend.Controller;

import com.example.Car_Servicing_Backend.DTO.LoginRequest;
import com.example.Car_Servicing_Backend.Model.Admin;
import com.example.Car_Servicing_Backend.Model.Booking;
import com.example.Car_Servicing_Backend.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")

public class AdminController {
    @Autowired
    private AdminService adminService;

    // Create Admin
    @PostMapping("/create")
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);
    }

    // Dashboard - View All Bookings
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return adminService.getAllBookings();
    }

    // Update Booking Status
    @PutMapping("/booking/{id}")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return adminService.updateBookingStatus(id, status);
    }

    // Delete Booking
    @DeleteMapping("/booking/{id}")
    public String deleteBooking(@PathVariable Long id) {
        adminService.deleteBooking(id);
        return "Booking Deleted Successfully";
    }

    @PostMapping("/login")
    public Admin login(@RequestBody LoginRequest request) {
       return adminService.login(request);
    }
}
