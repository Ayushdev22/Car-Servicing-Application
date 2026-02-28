package com.example.Car_Servicing_Backend.Controller;

import com.example.Car_Servicing_Backend.DTO.LoginRequest;
import com.example.Car_Servicing_Backend.Model.User;
import com.example.Car_Servicing_Backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }
    
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}
