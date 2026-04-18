package com.example.blockoff.repository;

import com.example.blockoff.unit.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    Optional<Unit> findByNumber(String number);
    Optional<Unit> findByEmail(String email);
    Optional<Unit> findByLink(String link);

    int countByNumber(String number);
    int countByEmail(String email);
    int countByLink(String link);
}