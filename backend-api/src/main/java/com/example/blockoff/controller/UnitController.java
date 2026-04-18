package com.example.blockoff.controller;

import com.example.blockoff.unit.Unit;
import com.example.blockoff.service.UnitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/units")
public class UnitController {
    @Autowired
    private UnitService unitService;

    @GetMapping("/{value}")
    public Unit report(@PathVariable String value) {
        return unitService.report(value);
    }

    @PostMapping("/{value}")
    public Unit addReport(@PathVariable String value, @RequestParam Long userId) {
        return unitService.addReport(value, userId);
    }
}