package com.wmdev.crud_demo.controller;

import com.wmdev.crud_demo.model.Record;
import com.wmdev.crud_demo.service.RecordService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@RestController
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "Content-Type")
@RequestMapping("/api/records")
@AllArgsConstructor
public class RecordController {

    private final RecordService recordService;

    // Retrieves a paginated list of all records, sorted by "id" in ascending order.
    @GetMapping()
    public ResponseEntity<?> getAllRecords(@PageableDefault(size = 5) Pageable page) {
        Pageable sortedPage = PageRequest.of(page.getPageNumber(), page.getPageSize(), Sort.by("id").ascending());
        Page<Record> recordsPage = recordService.findAllPageable(sortedPage);
        if (recordsPage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No records found.");
        }
        return ResponseEntity.ok(recordsPage);
    }

    // Retrieves a list of all records without pagination.
    @GetMapping("/all")
    public ResponseEntity<?> getAllRecords() {
        List<Record> records = recordService.findAll();
        if (records.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No records found.");
        }
        return ResponseEntity.ok(records);
    }

    // Saves a new record and returns the saved entity with HTTP status CREATED.
    @PostMapping("/save")
    public ResponseEntity<Record> saveRecord(@RequestBody Record toSave) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recordService.save(toSave));
    }

    // Updates an existing record by ID and returns the updated entity.
    @PutMapping("/update/{id}")
    public ResponseEntity<Record> updateRecord(@PathVariable("id") Integer id, @RequestBody Record updatedRecord) {
        Record updated = recordService.updateRecord(id, updatedRecord);
        if (updated != null) {
            return ResponseEntity.status(HttpStatus.OK).body(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Retrieves a specific record by ID.
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id) {
        Record record = recordService.getRecordById(id);
        if (record != null) {
            return ResponseEntity.ok(record);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Record not found.");
        }
    }

    // Deletes a specific record by ID.
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") Integer id) {
        recordService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Deletes multiple records by a list of IDs.
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAllById(@RequestParam("ids") List<Integer> ids) {
        recordService.deleteAllByIdInBatch(ids);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Showcase of custom sql query search method
    @GetMapping("/search/query-example")
    public ResponseEntity<List<Record>> findRecordsWithAgeGreaterThan(@RequestParam("age") int age) {
        List<Record> records = recordService.findRecordsWithAgeGreaterThan(age);
        return ResponseEntity.ok(records);
    }

    // Showcase of custom sql query search method
    @GetMapping("/search/query-example2")
    public ResponseEntity<List<Record>> findRecordsByNameOrEmail(@RequestParam("query") String query) {
        List<Record> records = recordService.findRecordsByNameOrEmail(query);
        return ResponseEntity.ok(records);
    }

    // Searches for records based on various query parameters, supports pagination.
    @GetMapping("/search")
    public ResponseEntity<Page<Record>> search(@RequestParam(value = "query", required = false) String query, @RequestParam(value = "age", required = false) Integer age, @RequestParam(value = "ageCondition", required = false) String ageCondition, @PageableDefault(size = 5) Pageable page) {

        Page<Record> records = recordService.findRecords(query, age, ageCondition, page);
        return ResponseEntity.ok(records);
    }

    // Uploads and processes a CSV file to create new records. Returns success or failure messages.
    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) throws IOException {

        String response = recordService.validateAndUploadCsv(file);
        if (!response.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }
}