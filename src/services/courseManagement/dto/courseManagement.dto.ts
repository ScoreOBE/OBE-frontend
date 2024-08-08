export class CourseManagementRequestDTO {
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 20;
}
