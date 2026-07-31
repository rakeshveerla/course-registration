package com.mru.registration.config;

import com.mru.registration.model.Course;
import com.mru.registration.model.Student;
import com.mru.registration.repository.CourseRepository;
import com.mru.registration.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

// CommandLineRunner's run() method fires once, automatically, right after
// the app starts. We use it to load the same sample data the old demo had -
// but only if the tables are still empty, so it never duplicates data.
@Component
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public DataSeeder(CourseRepository courseRepository, StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (courseRepository.count() == 0) {
            courseRepository.saveAll(List.of(
                    new Course("CS101", "Intro to Programming", 3),
                    new Course("CS204", "Data Structures", 2),
                    new Course("MA110", "Calculus I", 4),
                    new Course("EC150", "Microeconomics", 3),
                    new Course("PH120", "Classical Mechanics", 2),
                    new Course("CS310", "Database Systems", 2)
            ));
        }

        if (studentRepository.count() == 0) {
            List<Course> saved = courseRepository.findAll();
            Long c1 = saved.get(0).getId();
            Long c2 = saved.get(1).getId();
            Long c3 = saved.get(2).getId();
            Long c4 = saved.get(3).getId();
            Long c5 = saved.get(4).getId();

            Student s1 = new Student();
            s1.setRoll("REG-2026-014");
            s1.setName("Ananya Rao");
            s1.setEmail("ananya.rao@university.edu");
            s1.setProgram("B.Tech Computer Science");
            s1.setSemester("3");
            s1.setCourseIds(Arrays.asList(c1, c2));

            Student s2 = new Student();
            s2.setRoll("REG-2026-015");
            s2.setName("Rohan Mehta");
            s2.setEmail("rohan.mehta@university.edu");
            s2.setProgram("B.Sc Mathematics");
            s2.setSemester("2");
            s2.setCourseIds(Arrays.asList(c3));

            Student s3 = new Student();
            s3.setRoll("REG-2026-016");
            s3.setName("Sara Iqbal");
            s3.setEmail("sara.iqbal@university.edu");
            s3.setProgram("B.A Economics");
            s3.setSemester("4");
            s3.setCourseIds(Arrays.asList(c4, c1));

            Student s4 = new Student();
            s4.setRoll("REG-2026-017");
            s4.setName("Vikram Nair");
            s4.setEmail("vikram.nair@university.edu");
            s4.setProgram("B.Tech Electronics");
            s4.setSemester("5");
            s4.setCourseIds(List.of());

            Student s5 = new Student();
            s5.setRoll("REG-2026-018");
            s5.setName("Priya Das");
            s5.setEmail("priya.das@university.edu");
            s5.setProgram("B.Sc Physics");
            s5.setSemester("1");
            s5.setCourseIds(Arrays.asList(c5, c3, c2));

            studentRepository.saveAll(List.of(s1, s2, s3, s4, s5));
        }
    }
}
