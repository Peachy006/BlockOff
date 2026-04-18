package com.example.blockoff.controller;

import com.example.blockoff.unit.Unit;
import com.example.blockoff.service.UnitService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Units")
public class UnitController {
    @Autowired
    private UnitService unitService;

    @GetMapping("/report/number/{number}")
    public Unit reportByNumber(@PathVariable String number) {
        return unitService.reportByNumber(number);
    }

    @GetMapping("/report/email/{email}")
    public Unit reportByEmail(@PathVariable String email) {
        return unitService.reportByEmail(email);
    }

    @GetMapping("/report/link/{link}")
    public Unit reportByLink(@PathVariable String link) {
        return unitService.reportByLink(link);
    }

    @GetMapping("/number/{number}")
    public int getByNumber(@PathVariable String number) {
        return unitService.getByNumber(number);
    }

    @GetMapping("/email/{email}")
    public int getByEmail(@PathVariable String email) {
        return unitService.getByEmail(email);
    }

    @GetMapping("/link/{link}")
    public int getByLink(@PathVariable String link) {
        return unitService.getByLink(link);
    }
}