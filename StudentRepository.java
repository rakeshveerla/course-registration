package com.mru.registration.repository;

import com.mru.registration.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

// Extending JpaRepository instantly gives us findAll(), findById(),
// save(), deleteById(), count() ... with zero extra code.
public interface StudentRepository extends JpaRepository<Student, Long> {
}
