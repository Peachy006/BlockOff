package com.example.blockoff.service;
import com.example.blockoff.unit.Unit;

public interface UnitService {
    Unit report(String value);
    Unit addReport(String value, Long userId);
}