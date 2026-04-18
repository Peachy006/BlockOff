package com.example.blockoff.service;


import com.example.blockoff.repository.UnitRepository;
import com.example.blockoff.repository.UserRepository;
import com.example.blockoff.unit.Unit;
import com.example.blockoff.user.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UnitServiceImpl implements UnitService {
    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Unit report(String value) {
        return unitRepository.findByValue(value).orElse(null);
    }

    @Override
    public Unit addReport(String value, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        unitRepository.findByValue(value).ifPresent(existing -> {
            if (existing.getUser().getId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User has already reported this value");
            }
        });

        Unit unit = unitRepository.findByValue(value).orElseGet(() -> {
            Unit newUnit = new Unit();
            newUnit.setValue(value);
            return newUnit;
        });
        unit.setUser(user);
        unit.setReportCount(unit.getReportCount() + 1);
        return unitRepository.save(unit);
    }

}