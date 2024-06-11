export class CourseRequestDTO {
  academicYear: string = "";
  manage: boolean = false;
  orderBy: string = "courseNo";
  orderType: string = "asc";
  page: number = 1;
  limit: number = 20;
}
