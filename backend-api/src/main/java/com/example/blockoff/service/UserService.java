package com.example.blockoff.service;

import com.example.blockoff.user.User;

public interface UserService {
    User createUser(String email, String phoneNumber, String password);
    User getUser(Long id);
    User login(String email, String password);
}
