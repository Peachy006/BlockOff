package com.example.blockoff.unit;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "units")
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String link;
}
