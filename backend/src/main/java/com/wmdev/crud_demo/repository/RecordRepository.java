package com.wmdev.crud_demo.repository;

import com.wmdev.crud_demo.model.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Integer>, JpaSpecificationExecutor<Record> {
    
    @Query("SELECT r FROM Record r WHERE EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM r.dateOfBirth) > :age")
    List<Record> findAllWithAgeGreaterThan(@Param("age") int age);

    @Query("SELECT r FROM Record r WHERE LOWER(r.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(r.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(r.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Record> findByNameOrEmail(@Param("query") String query);
}
