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
    public Unit reportByNumber(String number) {
        return (Unit) unitRepository.findByNumber(number).orElse(null);
    }

    @Override
    public Unit reportByEmail(String email) {
        return (Unit) unitRepository.findByEmail(email).orElse(null);
    }

    @Override
    public Unit reportByLink(String link) {
        return (Unit) unitRepository.findByLink(link).orElse(null);
    }

    @Override
    public int getByNumber(String number) {
        return unitRepository.countByNumber(number);
    }

    @Override
    public int getByEmail(String email) {
        return unitRepository.countByEmail(email);
    }

    @Override
    public int getByLink(String link) {
        return unitRepository.countByLink(link);
    }
}