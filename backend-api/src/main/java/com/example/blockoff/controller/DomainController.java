package com.example.blockoff.controller;

import com.example.blockoff.service.DomainService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "http://localhost:3000") // Allows React to connect
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping("/age")
    public String getAge(@RequestParam String domain) {
        return domainService.getDomainCreationDate(domain);
    }
}