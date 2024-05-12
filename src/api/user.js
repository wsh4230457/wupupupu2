import request from "@/utils/request.js";
export const userRegisterService = (registerData) => {
  const params = new URLSearchParams();
  for (let key in registerData) {
    params.append(key, registerData[key]);
  }
  return request.get("/user/register", { params: params });
};

export const userLoginService = (loginData) => {
  const params = new URLSearchParams();
  for (let key in loginData) {
    params.append(key, loginData[key]);
  }
  return request.get("/user/login", { params: params });
};
export const userInfoService = () => {
  return request.get("/user/userInfo");
};
export const updateUserInfoService = (userInfo) => {
  return request.put("/user/update", userInfo);
};
export const updateAvatarUrlService = (AvatarURL) => {
  let params = new URLSearchParams();
  params.append("AvatarUrl",AvatarURL);
  return request.put("/user/updateAvatar", params);
};
export const updatePasswordService = (passwordData) => {
  return request.patch("/user/updatePassword", passwordData);
};
