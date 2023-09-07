-- AlterTable
ALTER TABLE "offered_course_sections" ADD COLUMN     "currentlyEnrolledStudent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxCapacity" INTEGER NOT NULL DEFAULT 0;
