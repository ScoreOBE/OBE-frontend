export class SkillRequestDTO {
  page: number = 1;
  perPage: number = 20;
  searchContent?: string;
  // filterColumn?: string;
  filterContent?: string[]; // skill tag
  filterANDContent?: string[];
  // sortColumn?: string = "name";
  sortOrderType?: "asc" | "desc";
  // ignoreIds?: string[] = [];
}
