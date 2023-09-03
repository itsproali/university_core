-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursePreRequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "CoursePreRequisite_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- AddForeignKey
ALTER TABLE "CoursePreRequisite" ADD CONSTRAINT "CoursePreRequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePreRequisite" ADD CONSTRAINT "CoursePreRequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
