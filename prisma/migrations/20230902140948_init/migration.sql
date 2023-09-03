/*
  Warnings:

  - You are about to drop the `CoursePreRequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoursePreRequisite" DROP CONSTRAINT "CoursePreRequisite_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CoursePreRequisite" DROP CONSTRAINT "CoursePreRequisite_preRequisiteId_fkey";

-- DropTable
DROP TABLE "CoursePreRequisite";

-- CreateTable
CREATE TABLE "CourseToPreRequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "CourseToPreRequisite_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- AddForeignKey
ALTER TABLE "CourseToPreRequisite" ADD CONSTRAINT "CourseToPreRequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToPreRequisite" ADD CONSTRAINT "CourseToPreRequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
