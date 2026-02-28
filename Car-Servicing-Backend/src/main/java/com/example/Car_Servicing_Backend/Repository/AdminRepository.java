package com.example.Car_Servicing_Backend.Repository;

import com.example.Car_Servicing_Backend.Model.Admin;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Long> {
   
    Optional<Admin> findByEmail(String email);
}
