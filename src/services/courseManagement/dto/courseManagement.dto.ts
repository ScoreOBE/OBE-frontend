export class CourseManagementRequestDTO {
  departmentCode?: string;
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 10;
}
