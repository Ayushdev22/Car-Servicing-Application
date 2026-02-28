package com.example.Car_Servicing_Backend.Repository;


import com.example.Car_Servicing_Backend.Model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
