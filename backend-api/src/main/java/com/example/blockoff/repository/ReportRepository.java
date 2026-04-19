package com.example.blockoff.repository;

import com.example.blockoff.unit.Report;
import com.example.blockoff.user.User;
import com.example.blockoff.unit.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByUnitAndUser(Unit unit, User user);
}