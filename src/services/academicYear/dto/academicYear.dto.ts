export class AcademicYearRequestDTO {
  manage: boolean = false;
  orderBy: string = "year";
  orderType: string = "desc";
}

export class CreateAcademicYearRequestDTO {
  year: number = -1;
  semester: number = -1;
}
