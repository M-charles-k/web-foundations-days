
-- Day 6 Assignment: School Database Design
-- Database: SQLite

PRAGMA foreign_keys = ON;

-- Remove existing tables so the script can be run again.
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. Students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 3. Enrolments join table
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolment_date TEXT NOT NULL,
    grade REAL,

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);

-- INSERT SAMPLE STUDENTS
INSERT INTO students (student_id, full_name, email)
VALUES
    (1, 'Amina Otieno', 'amina@example.com'),
    (2, 'Brian Mwangi', 'brian@example.com'),
    (3, 'Grace Wanjiku', 'grace@example.com'),
    (4, 'David Kamau', 'david@example.com');

-- INSERT SAMPLE COURSES
INSERT INTO courses (course_id, course_name, description)
VALUES
    (1, 'Web Development', 'HTML, CSS and JavaScript'),
    (2, 'Database Systems', 'SQL and database design'),
    (3, 'Computer Networking', 'Networking fundamentals');

-- INSERT SAMPLE ENROLMENTS
INSERT INTO enrolments
    (enrolment_id, student_id, course_id, enrolment_date, grade)
VALUES
    (1, 1, 1, '2026-10-01', 85),
    (2, 1, 2, '2026-10-02', 90),
    (3, 2, 1, '2026-10-03', 78),
    (4, 2, 3, '2026-10-04', 82),
    (5, 3, 2, '2026-10-05', 88);

-- QUERY 1: All courses for one student, by name
SELECT
    s.full_name,
    c.course_name
FROM students AS s
JOIN enrolments AS e
    ON s.student_id = e.student_id
JOIN courses AS c
    ON e.course_id = c.course_id
WHERE s.full_name = 'Amina Otieno'
ORDER BY c.course_name;

-- QUERY 2: All students enrolled in one course
SELECT
    c.course_name,
    s.full_name,
    s.email
FROM courses AS c
JOIN enrolments AS e
    ON c.course_id = e.course_id
JOIN students AS s
    ON e.student_id = s.student_id
WHERE c.course_name = 'Web Development'
ORDER BY s.full_name;

-- QUERY 3: Number of students per course
-- LEFT JOIN includes courses with zero enrolments.
SELECT
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e
    ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_name;

-- QUERY 4: Students who have no enrolments
SELECT
    s.student_id,
    s.full_name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e
    ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 92
WHERE student_id = 1
  AND course_id = 2;

-- Verify the updated grade
SELECT
    s.full_name,
    c.course_name,
    e.grade
FROM enrolments AS e
JOIN students AS s
    ON e.student_id = s.student_id
JOIN courses AS c
    ON e.course_id = c.course_id
WHERE s.student_id = 1
  AND c.course_id = 2;
