//定制请求的实例

//导入axios  npm install axios
import axios from "axios";
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = "/api";
const instance = axios.create({ baseURL });
import { useTokenStore } from "@/stores/token.js";
import { ElMessage } from "element-plus";
import router from "@/router";
//添加响应拦截器
instance.interceptors.response.use(
  (result) => {
    // 判断业务状态码
    if (result.data.code === 0) {
      return result.data;
    } else {
      alert(result.data.message ? result.data.message : "服务异常");
      return Promise.reject(result.data);
    }
  },
  (err) => {
    if (err.response.status === 401) {
      ElMessage.error("请先登入");
      router.push("/login");
    } else {
      alert("服务异常");
    }

    return Promise.reject(err); //异步的状态转化成失败的状态
  }
);
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
export default instance;
