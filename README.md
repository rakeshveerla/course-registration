# Course Registration — Spring Boot + MySQL

A minimal, beginner-friendly full-stack app: your existing HTML/CSS/JS frontend,
now backed by a real Spring Boot REST API and a MySQL database, instead of
in-memory JavaScript arrays that reset on every page refresh.

## What's in this project

```
mru-registration/
├── pom.xml                                 <- Maven dependencies (just 3!)
└── src/main/
    ├── java/com/mru/registration/
    │   ├── RegistrationApplication.java    <- starts the app
    │   ├── model/Student.java              <- 1 class = 1 database table
    │   ├── model/Course.java
    │   ├── repository/StudentRepository.java  <- gives you CRUD for free
    │   ├── repository/CourseRepository.java
    │   ├── controller/StudentController.java  <- the REST API (/api/students)
    │   ├── controller/CourseController.java    <- the REST API (/api/courses)
    │   └── config/DataSeeder.java           <- loads sample data on first run
    └── resources/
        ├── application.properties          <- MySQL connection settings
        └── static/                          <- your frontend, served directly
            ├── index.html
            ├── style.css
            └── script.js
```

Because the frontend files live in `src/main/resources/static/`, Spring Boot
serves them itself. There's only **one** server, running on **one** port
(8080) — no CORS setup needed, no second dev server.

## How the pieces fit together

1. **Student.java / Course.java** — plain Java classes. `@Entity` tells
   Spring "turn this into a table". Hibernate creates the tables for you.
2. **StudentRepository / CourseRepository** — just an empty interface each.
   Extending `JpaRepository` instantly gives you `.findAll()`, `.save()`,
   `.deleteById()`, etc. — no SQL to write.
3. **StudentController / CourseController** — these expose the repository
   methods as web addresses (endpoints), e.g. `GET /api/students`.
4. **script.js** — instead of a hardcoded array, it now does
   `fetch('/api/students')` to read data, and `fetch(..., {method:'POST'})`
   to add/update/delete. The screen logic (search, filters, seat counting)
   is untouched.

## Setup

### 1. Install prerequisites
- **Java 17+** — `java -version` to check
- **Maven** — `mvn -version` to check (or use an IDE like IntelliJ/Eclipse/VS Code, which bundle Maven)
- **MySQL** — running locally (e.g. via MySQL Workbench, XAMPP, or `mysql.server start`)

### 2. Configure your database password
Open `src/main/resources/application.properties` and change:
```properties
spring.datasource.password=your_mysql_password
```
to your actual MySQL root password. You do **not** need to create the
`course_registration` database yourself — the connection string has
`createDatabaseIfNotExist=true`, so it's created automatically the first
time you run the app.

### 3. Run the app
From the `mru-registration` folder:
```bash
mvn spring-boot:run
```
Or open the project in your IDE and run `RegistrationApplication.java`.

### 4. Open it in your browser
```
http://localhost:8080
```
You'll see the same interface as before, but now every add/edit/delete is
saved permanently in MySQL — refreshing the page keeps your data.

## Trying the API directly (optional)
You can also poke the backend without the UI, e.g. with `curl`:
```bash
curl http://localhost:8080/api/students
curl http://localhost:8080/api/courses
```

## Notes for beginners
- `spring.jpa.hibernate.ddl-auto=update` means Hibernate keeps your MySQL
  tables in sync with the Java classes automatically. Great while learning;
  in a real production app you'd normally use versioned SQL migration
  scripts instead.
- The seat-availability logic (which courses are "full") is still computed
  in `script.js`, exactly as it worked before — the backend's job is only
  to store and return data, keeping it as simple as possible.
- If port `8080` is already in use, change `server.port` in
  `application.properties`.
