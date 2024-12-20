import { isValidResponse } from "@/helpers/functions/validation";
import { userController } from "./user.repository";
import { IModelUser } from "@/models/ModelUser";

const userService = userController();

export const getUserInfo = async (): Promise<IModelUser> => {
  const res = await userService.getUserInfo();
  return isValidResponse(res);
};

export const termsOfService = async (params: {
  agree: boolean;
}): Promise<any> => {
  const res = await userService.termsOfService(params);
  return isValidResponse(res);
};

export const getInstructor = async (): Promise<IModelUser[]> => {
  const res = await userService.getInstructor();
  return isValidResponse(res);
};

export const updateUser = async (params: Partial<IModelUser>) => {
  const res = await userService.updateUser(params);
  return isValidResponse(res);
};

export const updateAdmin = async (params: Partial<IModelUser>) => {
  const res = await userService.updateAdmin(params);
  return isValidResponse(res);
};

export const updateSAdmin = async (params: Partial<IModelUser>) => {
  const res = await userService.updateSAdmin(params);
  return isValidResponse(res);
};

export const logout = () => {
  userService.logout();
};
