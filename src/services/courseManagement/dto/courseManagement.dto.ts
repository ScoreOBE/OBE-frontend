export class CourseManagementSearchDTO {
  curriculum?: string[] = [];
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 10;
  ignorePage?: boolean = false;
}

export class CourseManagementRequestDTO {
  courseNo: string = "";
  courseName: string = "";
  updatedYear: number = 0;
  updatedSemester: number = 0;
  type: string = "";
}
