/*
  Warnings:

  - Added the required column `academicDepartmentId` to the `offered_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offered_courses" ADD COLUMN     "academicDepartmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_courses" ADD CONSTRAINT "offered_courses_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
