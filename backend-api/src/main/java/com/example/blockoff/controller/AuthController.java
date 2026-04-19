package com.example.blockoff.controller;

import com.example.blockoff.service.UserService;
import com.example.blockoff.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "chrome-extension://lkpnjncioceiadifnbmeaioognfcgboc"
})
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password) {
        User user = userService.login(email, password);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(user);
    }
}
