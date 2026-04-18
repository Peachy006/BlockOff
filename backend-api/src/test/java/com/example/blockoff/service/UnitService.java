package com.example.blockoff.service;
import com.example.blockoff.unit.Unit;
import org.springframework.stereotype.Service;

import java.util.List;


//Simple interface for getting and saving reports

@Service
public interface UnitService {
    public Unit reportByNumber(String number);
    public Unit reportByEmail(String email);
    public Unit reportByLink(String link);

    public int getByNumber(String number);
    public int getByEmail(String email);
    public int getByLink(String link);
}