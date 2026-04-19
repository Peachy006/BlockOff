package com.example.blockoff.service;

import com.example.blockoff.repository.ReportRepository;
import com.example.blockoff.repository.UnitRepository;
import com.example.blockoff.repository.UserRepository;
import com.example.blockoff.unit.Report;
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

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public Unit report(String value) {
        return unitRepository.findByValue(value).orElse(null);
    }

    @Override
    public Unit addReport(String value, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Unit unit = unitRepository.findByValue(value).orElseGet(() -> {
            Unit newUnit = new Unit();
            newUnit.setValue(value);
            return unitRepository.save(newUnit);
        });

        if (reportRepository.existsByUnitAndUser(unit, user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User has already reported this value");
        }

        Report report = new Report();
        report.setUnit(unit);
        report.setUser(user);
        reportRepository.save(report);

        unit.setReportCount(unit.getReportCount() + 1);
        return unitRepository.save(unit);
    }
}