package com.wmdev.crud_demo.service;
import com.wmdev.crud_demo.model.Record;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class RecordSpecification {
    public static Specification<Record> byStringQuery(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (query == null || query.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            String searchPattern = "%" + query.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern)
            );
        };
    }

    public static Specification<Record> byAgeCondition(int age, String condition) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (condition == null || condition.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            //TODO The birthday must be taken into account in the calculations.
            Expression<Integer> currentYearExpr = criteriaBuilder.function("date_part", Integer.class, criteriaBuilder.literal("YEAR"), criteriaBuilder.currentDate());
            Expression<Integer> birthYearExpr = criteriaBuilder.function("date_part", Integer.class, criteriaBuilder.literal("YEAR"), root.get("dateOfBirth"));
            Expression<Integer> ageExpr = criteriaBuilder.diff(currentYearExpr, birthYearExpr);

            return switch (condition) {
                case "Greater" -> criteriaBuilder.greaterThan(ageExpr, age);
                case "GreaterEqual" -> criteriaBuilder.greaterThanOrEqualTo(ageExpr, age);
                case "Less" -> criteriaBuilder.lessThan(ageExpr, age);
                case "LessEqual" -> criteriaBuilder.lessThanOrEqualTo(ageExpr, age);
                case "Equal" -> criteriaBuilder.equal(ageExpr, age);
                default -> criteriaBuilder.conjunction();
            };
        };
    }
}
