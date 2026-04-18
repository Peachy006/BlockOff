package com.example.blockoff.service;


import com.example.blockoff.repository.UnitRepository;
import com.example.blockoff.unit.Unit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnitServiceImpl implements UnitService {
    @Autowired
    private UnitRepository unitRepository;

    @Override
    public Unit report(String value) {
        return unitRepository.findByValue(value).orElse(null);
    }

    @Override
    public Unit addReport(String value) {
        Unit unit = unitRepository.findByValue(value).orElseGet(() -> {
            Unit newUnit = new Unit();
            newUnit.setValue(value);
            return newUnit;
        });
        unit.setReportCount(unit.getReportCount() + 1);
        return unitRepository.save(unit);
    }

}