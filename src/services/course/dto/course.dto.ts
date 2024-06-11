export class CourseRequestDTO {
  academicYear: string = "";
  manage: boolean = false;
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 20;
}
