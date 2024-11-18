import { isValidResponse } from "@/helpers/functions/validation";
import { scoreController } from "./score.repository";

const scoreService = scoreController();

export const uploadScore = async (params: any) => {
  const res = await scoreService.uploadScore(params);
  return isValidResponse(res);
};
export const updateAssignmentName = async (params: any) => {
  const res = await scoreService.updateAssignmentName(params);
  return isValidResponse(res);
};
export const deleteAssignment = async (params: any) => {
  const res = await scoreService.deleteAssignment(params);
  return isValidResponse(res);
};
export const publishScore = async (params: any) => {
  const res = await scoreService.publishScore(params);
  return isValidResponse(res);
};
export const updateStudentScore = async (params: any) => {
  const res = await scoreService.updateStudentScore(params);
  return isValidResponse(res);
};
