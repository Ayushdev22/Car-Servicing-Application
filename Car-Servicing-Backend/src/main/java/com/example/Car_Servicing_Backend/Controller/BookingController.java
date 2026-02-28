package com.example.Car_Servicing_Backend.Controller;

import com.example.Car_Servicing_Backend.Model.Booking;
import com.example.Car_Servicing_Backend.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/user/{id}")
    public List<Booking> getUserBookings(@PathVariable Long id) {
        return bookingService.getUserBookings(id);
    }
    // Check Booking Status
    @GetMapping("/booking/{id}/status")
    public String checkBookingStatus(@PathVariable Long id) {
        return bookingService.getBookingStatus(id);
    }
}
