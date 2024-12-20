import { isValidResponse } from "@/helpers/functions/validation";
import { authenticationController } from "./authentication.repository";

const authService = authenticationController();

export const logIn = async (code: string) => {
  const res = await authService.login({
    code,
    redirectUri: import.meta.env.VITE_CMU_ENTRAID_REDIRECT_URL,
  });
  return isValidResponse(res);
};
