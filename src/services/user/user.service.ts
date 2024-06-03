import { isValidResponse } from "@/helpers/functions/validation";
import { userController } from "./user.repository";

const userService = userController();

export const getUserInfo = async () => {
  console.log(localStorage.getItem("token"));

  const res = await userService.getUserInfo();
  return isValidResponse(res);
};
