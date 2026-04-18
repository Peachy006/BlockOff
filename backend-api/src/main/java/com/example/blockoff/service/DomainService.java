package com.example.blockoff.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class DomainService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getDomainCreationDate(String domain) {
        String url = "https://rdap.org/domain/" + domain;
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> events = (List<Map<String, Object>>) response.get("events");

            return events.stream()
                    .filter(e -> "registration".equals(e.get("eventAction")))
                    .map(e -> e.get("eventDate").toString())
                    .findFirst()
                    .orElse("Creation date not found");
        } catch (Exception e) {
            return "Error retrieving data: " + e.getMessage();
        }
    }
}