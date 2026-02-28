package com.example.Car_Servicing_Backend.Service;

import com.example.Car_Servicing_Backend.DTO.LoginRequest;
import com.example.Car_Servicing_Backend.Model.User;
import com.example.Car_Servicing_Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository ;

    public User register(User user){
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return user;
    }

}
