<script setup>
import { User, Lock, Message } from "@element-plus/icons-vue";
import { h, ref } from "vue";

//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false);
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
});
const loginData = ref({
  username: "",
  password: "",
});
const checkPassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerData.value.password) {
    callback(new Error("输入密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5到16非空字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5到16非空字符", trigger: "blur" },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5到16非空字符", trigger: "blur" },
    { validator: checkPassword, trigger: "blur" },
  ],
};
import { userRegisterService, userLoginService } from "@/api/user.js";
const register = async () => {
  if (registerData.value.password === registerData.value.rePassword) {
    let result = await userRegisterService(registerData.value);

    successMessage(result.message);
  } else {
    successMessage("密码输入不一致");
  }
};
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";
const tokenStore = useTokenStore();

const router = useRouter();
const login = async () => {
  console.log(loginData.value);
  let result = await userLoginService(loginData.value);
  tokenStore.setToken(result.data);

  successMessage(result.message);

  router.push("/");
};
const clearRegisterData = () => {
  registerData.value = {
    username: "",
    password: "",
    rePassword: "",
  };
};
import { ElNotification } from "element-plus";
// 统一返回提示函数
const successMessage = (result) => {
  ElNotification({
    title: "提醒:",
    message: h("i", { style: "color: teal" }, result),
    duration: 2000,
  });
};
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="registerData.rePassword"
          ></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            @click="register"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="
              isRegister = false;
              clearRegisterData();
            "
          >
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
        :model="loginData"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="loginData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="loginData.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url("@/assets/logo2.png") no-repeat 60% center / 240px auto,
      url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
