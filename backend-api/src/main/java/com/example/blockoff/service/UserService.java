package com.example.blockoff.service;

import com.example.blockoff.user.User;

public interface UserService {
    User createUser(String email, String phoneNumber);
    User getUser(Long id);
}
