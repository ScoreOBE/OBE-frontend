export class CourseRequestDTO {
  year: number = 2567;
  semester: number = 1;
  manage: boolean = false;
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 20;
  departmentCode?: string[] = [];
  tqf3?: string[] = [];
  tqf5?: string[] = [];
}
