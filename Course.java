package com.mru.registration.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// @Entity tells Spring: "this class is a database table".
// Each field below becomes a column automatically.
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL auto-increments the id
    private Long id;

    private String code;   // e.g. "CS101"
    private String title;  // e.g. "Intro to Programming"
    private int seats;     // total seats available in this course

    public Course() {
        // JPA needs an empty constructor - do not remove
    }

    public Course(String code, String title, int seats) {
        this.code = code;
        this.title = title;
        this.seats = seats;
    }

    // ---- Getters and setters (plain and simple) ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }
}
