package com.wmdev.crud_demo.service;

import com.wmdev.crud_demo.model.Record;
import com.wmdev.crud_demo.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@RequiredArgsConstructor

public class RecordService {
    private final RecordRepository repository;

    public Record updateRecord(Integer id, Record updated) {
        Record existingRecord = getRecordById(id);
        if (existingRecord != null) {
            existingRecord.setFirstName(updated.getFirstName());
            existingRecord.setLastName(updated.getLastName());
            existingRecord.setEmail(updated.getEmail());
            existingRecord.setDateOfBirth(updated.getDateOfBirth());
            existingRecord.setGender(updated.getGender());
            return save(existingRecord);
        } else return null;
    }

    public String validateAndUploadCsv(MultipartFile file) throws IOException {

        List<Record> records = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>();

        InputStreamReader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder().setHeader().setIgnoreHeaderCase(true).setTrim(true).build();
        CSVParser csvParser = new CSVParser(reader, csvFormat);

        int rowNumber = 1;

        for (CSVRecord csvRecord : csvParser) {
            Record record = new Record();
            boolean isValid = true;

            String firstName = csvRecord.get("firstName");
            if (firstName == null || firstName.trim().isEmpty()) {
                errorMessages.add("ROW" + rowNumber + ": First name is missing or empty.");
                isValid = false;
            }
            record.setFirstName(firstName);

            String lastName = csvRecord.get("lastName");
            if (lastName == null || lastName.trim().isEmpty()) {
                errorMessages.add("ROW" + rowNumber + ": Last name is missing or empty.");
                isValid = false;
            }
            record.setLastName(lastName);

            String email = csvRecord.get("email");
            if (email == null || !isValidEmail(email)) {
                errorMessages.add("ROW" + rowNumber + ": Invalid email format: " + email);
                isValid = false;
            }
            record.setEmail(email);

            String dateOfBirthStr = csvRecord.get("dateOfBirth");
            LocalDate dateOfBirth = null;
            try {
                dateOfBirth = LocalDate.parse(dateOfBirthStr);
            } catch (DateTimeParseException e) {
                errorMessages.add("ROW" + rowNumber + ": Invalid date format for dateOfBirth: " + dateOfBirthStr);
                isValid = false;
            }
            record.setDateOfBirth(dateOfBirth);

            String genderStr = csvRecord.get("gender");
            if (genderStr == null || genderStr.length() != 1 || !("M".equalsIgnoreCase(genderStr) || "F".equalsIgnoreCase(genderStr))) {
                errorMessages.add("ROW" + rowNumber + ": Invalid gender value: " + genderStr);
                isValid = false;
            } else {
                record.setGender(genderStr.toUpperCase().charAt(0));
            }

            if (isValid) {
                records.add(record);
            }

            rowNumber++;
        }

        String response = "";
        if (!errorMessages.isEmpty()) {
            response = String.join("\n", errorMessages);
        } else {
            saveAllAndFlush(records);
        }
        return response;
    }

    public Record getRecordById(Integer id) {
        Optional<Record> existingRecord = repository.findById(id);
        return existingRecord.orElse(null);
    }

    public Page<Record> findAllPageable(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Record> findAll() {
        return repository.findAll();
    }

    public <S extends Record> S save(S entity) {
        return repository.save(entity);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        repository.deleteAllByIdInBatch(integers);
    }

    public List<Record> findRecordsWithAgeGreaterThan(int age) {
        return repository.findAllWithAgeGreaterThan(age);
    }

    public List<Record> findRecordsByNameOrEmail(String query) {
        return repository.findByNameOrEmail(query);
    }

    public Page<Record> findRecords(String query, Integer age, String ageCondition, Pageable pageable) {
        Specification<Record> spec = Specification.where(RecordSpecification.byStringQuery(query));

        if (age != null && ageCondition != null) {
            spec = spec.and(RecordSpecification.byAgeCondition(age, ageCondition));
        }

        return repository.findAll(spec, pageable);
    }

    public <S extends Record> void saveAllAndFlush(Iterable<S> entities) {
        repository.saveAllAndFlush(entities);
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }
}
