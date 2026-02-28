package com.example.Car_Servicing_Backend.Service;

import com.example.Car_Servicing_Backend.DTO.LoginRequest;
import com.example.Car_Servicing_Backend.Model.Admin;
import com.example.Car_Servicing_Backend.Model.Booking;
import com.example.Car_Servicing_Backend.Repository.AdminRepository;
import com.example.Car_Servicing_Backend.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Create Admin
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Get All Bookings (Dashboard)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Update Booking Status
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // Delete Booking (optional)
    public void deleteBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }
    public Admin login(LoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin Not Found"));

        if (!admin.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return admin;
    }
}
