package com.mru.registration.controller;

import com.mru.registration.model.Course;
import com.mru.registration.repository.CourseRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // GET http://localhost:8080/api/courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}
