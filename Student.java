package com.mru.registration.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roll;      // e.g. "REG-2026-014"
    private String name;
    private String email;
    private String program;   // e.g. "B.Tech Computer Science"
    private String semester;  // e.g. "3"

    // The ids of the courses this student is enrolled in.
    // @ElementCollection makes Hibernate create a small helper table
    // (student_courses) automatically - no extra code needed.
    @ElementCollection
    private List<Long> courseIds = new ArrayList<>();

    public Student() {
        // JPA needs an empty constructor - do not remove
    }

    // ---- Getters and setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoll() { return roll; }
    public void setRoll(String roll) { this.roll = roll; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public List<Long> getCourseIds() { return courseIds; }
    public void setCourseIds(List<Long> courseIds) { this.courseIds = courseIds; }
}
