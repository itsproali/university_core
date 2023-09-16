/*
  Warnings:

  - You are about to alter the column `totalMarks` on the `student_enrolled_courses` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "student_enrolled_courses" ADD COLUMN     "status" "StudentEnrolledCourseStatus" DEFAULT 'ONGOING',
ALTER COLUMN "totalMarks" SET DEFAULT 0,
ALTER COLUMN "totalMarks" SET DATA TYPE INTEGER;
