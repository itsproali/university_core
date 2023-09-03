export interface ICourseProps {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses?: [
    {
      courseId: string;
      isDeleted?: boolean | null;
    }
  ];
}
