package com.mru.registration.controller;

import com.mru.registration.model.Student;
import com.mru.registration.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // READ ALL
    // GET http://localhost:8080/api/students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // CREATE
    // POST http://localhost:8080/api/students
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        // Auto-generate the roll number, same numbering style as before (REG-2026-019, 020, ...)
        long nextNumber = 19 + studentRepository.count();
        student.setRoll("REG-2026-" + String.format("%03d", nextNumber));
        student.setId(null); // make sure we always create a brand-new row
        return studentRepository.save(student);
    }

    // UPDATE
    // PUT http://localhost:8080/api/students/5
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student updated) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));

        student.setName(updated.getName());
        student.setEmail(updated.getEmail());
        student.setProgram(updated.getProgram());
        student.setSemester(updated.getSemester());
        student.setCourseIds(updated.getCourseIds());

        return studentRepository.save(student);
    }

    // DELETE
    // DELETE http://localhost:8080/api/students/5
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }
}
