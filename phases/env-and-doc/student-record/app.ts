import { getDb, closeDb } from '../../../db.js';
import type { Student, Course } from './types.js';

async function run() {
  const db = await getDb('university');
  const students = db.collection<Student>('students');
  const courses = db.collection<Course>('courses');

  try {
    await students.deleteMany({});
    await courses.deleteMany({});

    const coursesData: Course[] = [
      {
        title: 'MongoDB Mastery',
        instructor: { name: 'Arjun Mehta', specialty: 'Database' },
        maxCapacity: 30,
      },
      {
        title: 'TypeScript Pro',
        instructor: { name: 'Sneha Rao', specialty: 'Web Architecture' },
        maxCapacity: 25,
      },
      {
        title: 'React Patterns',
        instructor: { name: 'Rahul K.', specialty: 'Frontend' },
        maxCapacity: 40,
      },
      {
        title: 'Node.js Backend',
        instructor: { name: 'Priya Singh', specialty: 'Backend' },
        maxCapacity: 20,
      },
      {
        title: 'DevOps Basics',
        instructor: { name: 'Amit Shah', specialty: 'Cloud' },
        maxCapacity: 15,
      },
    ];

    const courseResult = await courses.insertMany(coursesData);
    const coursesId = Object.values(courseResult.insertedIds);
    console.log('5 Courses seeded.');

    const studentsData: Student[] = Array.from({ length: 20 }).map((_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@email.com`,
      enrolledCourses: [
        {
          courseId: coursesId[Math.floor(Math.random() * coursesId.length)]!,
          enrolledAt: new Date(),
        },
      ],
    }));

    await students.insertMany(studentsData);
    console.log('20 Students seeded.');

    const allStudents = await students.find().toArray();
    console.log('\n--- Student Records Sample ---');
    allStudents.slice(0, 5).forEach((s) => {
      console.log(
        `${s.name} is enrolled in ${s.enrolledCourses.length} course(s)`
      );
    });
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
