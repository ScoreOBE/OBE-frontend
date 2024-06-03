import axios from "axios";

const getConfig = (configService: any, params?: any) => {
  let token = localStorage.getItem("token");
  const config = {
    baseURL: configService.baseApiPath
      ? configService.baseApiPath
      : `${import.meta.env.VITE_BASE_API}${import.meta.env.VITE_BASE_PATH_API}`,
    onUploadProgress: (progressEvent: any) => {
      if (configService.onUploadProgress) {
        configService.onUploadProgress(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
      }
    },
    onDownloadProgress: (progressEvent: any) => {
      if (configService.onDownloadProgress) {
        configService.onDownloadProgress(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
      }
    },
    headers: {
      lang: params?.data?.lang,
      ...(params?.token
        ? { Authorization: "Bearer " + params?.token }
        : token
        ? { Authorization: "Bearer " + token }
        : {}),
      ...(configService?.headers || {}),
    },
    params: params || configService.params,
    data: configService.data,
    ...(configService.responseType
      ? { responseType: configService.responseType }
      : {}),
  };
  console.log(config);
  
  return config;
};

const axiosSuccess = (res: any, configService?: any) => {
  return res.data;
};

const axiosError = (error: any, configService?: any) => {
  return error.response.data.message;
};

const axiosService = (
  type: string,
  url: string,
  params: any,
  configService: any
) => {
  let config = getConfig(configService, "get".includes(type) ? params : null);
  switch (type) {
    case "get":
      return axios
        .get(url, config)
        .then((res) => axiosSuccess(res, configService))
        .catch((err) => axiosError(err, configService));
    case "post":
      return axios
        .post(url, params, config)
        .then((res) => axiosSuccess(res, configService))
        .catch((err) => axiosError(err, configService));
    case "put":
      return axios
        .put(url, params, config)
        .then((res) => axiosSuccess(res, configService))
        .catch((err) => axiosError(err, configService));
    case "patch":
      return axios
        .patch(url, params, config)
        .then((res) => axiosSuccess(res, configService))
        .catch((err) => axiosError(err, configService));
    case "delete":
      return axios
        .delete(url, config)
        .then((res) => axiosSuccess(res, configService))
        .catch((err) => axiosError(err, configService));
    default:
      return false;
  }
};

export default (configService = {}) => {
  return {
    get: (url: string, params?: any) =>
      axiosService("get", url, params, configService),
    post: (url: string, params: any) =>
      axiosService("post", url, params, configService),
    put: (url: string, params: any) =>
      axiosService("put", url, params, configService),
    patch: (url: string, params: any) =>
      axiosService("patch", url, params, configService),
    delete: (url: string, params: any) =>
      axiosService("delete", url, params, configService),
  };
};
