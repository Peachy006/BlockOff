package com.example.blockoff.controller;

import com.example.blockoff.service.UserService;
import com.example.blockoff.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080",
                        "chrome-extension://lkpnjncioceiadifnbmeaioognfcgboc"})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User createUser(@RequestParam String email, @RequestParam String phoneNumber, @RequestParam String password) {
        return userService.createUser(email, phoneNumber, password);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
