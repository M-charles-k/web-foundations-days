
# School Database Design

## 1. Students Table

The `students` table stores information about students. Each student has a unique student ID, full name and email address. The student ID is the primary key, while the email is required and must be unique to prevent two students from registering with the same email.

## 2. Courses Table

The `courses` table stores information about courses offered by the school. Each course has a unique course ID, course name and optional description. The course ID is the primary key, and the course name is also unique.

## 3. Enrolments Table

The `enrolments` table records which students have enrolled in which courses. It contains an enrolment ID, student ID, course ID, enrolment date and optional grade. The student ID and course ID are foreign keys referencing the students and courses tables. A unique constraint on the combination of student ID and course ID prevents duplicate enrolments.

## 4. Relationships Between the Tables

### One-to-Many Relationships

- **Students to Enrolments:** One student can have multiple enrolment records, but each enrolment belongs to one student.
- **Courses to Enrolments:** One course can have multiple enrolment records, but each enrolment refers to one course.

These relationships are implemented using foreign keys in the enrolments table.

### Many-to-Many Relationship

Students and courses have a many-to-many relationship because one student can take several courses, and one course can have several students.

The `enrolments` table acts as a join table between students and courses. It resolves the many-to-many relationship by storing pairs of student IDs and course IDs. It also stores information specific to each enrolment, such as the enrolment date and grade.

Without a join table, the database would need to store repeated course information in student records or repeated student information in course records, making the design harder to maintain.

## 5. Recommended Index

I would add an index on `enrolments.course_id` to help the database find enrolments for a particular course more efficiently. This is useful when listing all students in a course or calculating the number of students enrolled in each course.

Example:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

The index improves lookup performance, although it requires extra storage and can add overhead to insertions, updates and deletions.

## 6. SQL or NoSQL?

I would choose a relational SQL database such as SQLite for this school system. The data has clear relationships between students, courses and enrolments, and the system needs reliable constraints to prevent duplicate enrolments and invalid references. SQL supports primary keys, foreign keys, unique constraints, joins and structured queries, making it well suited to this design. A NoSQL database could also store this information, but SQL provides a natural way to enforce the relationships and maintain data integrity.
```

## 3. Run the assignment in SQLite

You can use [SQLiteOnline](https://sqliteonline.com/) to test the script without installing a database server.

<list marker="number" gap={2}>
  <list-item>Open SQLiteOnline and select SQLite.</list-item>
  <list-item>Copy all the contents of `school.sql` into the SQL editor.</list-item>
  <list-item>Run the script.</list-item>
  <list-item>Check the output for each of the five queries and the final grade verification query.</list-item>
  <list-item>Confirm that Query 4 returns David Kamau and that the final query shows Amina Otieno's Database Systems grade as `92`.</list-item>
</list>

**Expected results for the key queries:**

| Query | Expected result |
|---|---|
| Courses for Amina Otieno | 2 courses |
| Students in Web Development | 2 students |
| Students per course | 2, 2 and 1 |
| Students with no enrolments | David Kamau |
| Updated grade | 92 |

## 4. Commit and push to GitHub

In your Kali terminal, run:

```bash
cd ~/Documents/web-foundations/web-foundations-days

git add day6/school.sql day6/school-design.md

git commit -m "Day 6 assignment"

git push
```

If your repository is located elsewhere, change the `cd` path to its actual location.

Before pushing, make sure both files are saved and that the SQL script runs without errors. The script deliberately drops and recreates its three tables at the beginning, so **do not run it against a database containing data you need to keep**.