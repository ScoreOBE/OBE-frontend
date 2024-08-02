import { isValidResponse } from "@/helpers/functions/validation";
import { facultyController } from "./faculty.repository";

const userService = facultyController();

export const getDepartment = async (facultyCode: string) => {
  const res = await userService.getDepartment(facultyCode);
  return isValidResponse(res);
};
