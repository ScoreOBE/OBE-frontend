import { isValidResponse } from "@/helpers/functions/validation";
import { userController } from "./user.repository";
import { IModelUser } from "@/models/ModelUser";

const userService = userController();

export const getUserInfo = async () => {
  const res = await userService.getUserInfo();
  return isValidResponse(res);
};
export const updateUser = async (params: Partial<IModelUser>) => {
  const res = await userService.updateUser(params);
  return isValidResponse(res);
};

