<script setup>
import { ref } from "vue";
const rules = {
  nickname: [
    { required: true, message: "请输入用户昵称", trigger: "blur" },
    {
      pattern: /^\S{2,10}$/,
      message: "昵称必须是2-10位的非空字符串",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入用户邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
};
import { userInfoStore } from "@/stores/userInfo.js";

const InfoStore = userInfoStore();
const userInfo = ref({ ...InfoStore.info });
import { updateUserInfoService } from "@/api/user.js";
import { ElMessage, ElMessageBox } from "element-plus";
const updateInfo = () => {
  ElMessageBox.confirm(
    "确定这样修改吗?",
    "Warning",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      let result = await updateUserInfoService(userInfo.value);

      ElMessage({
        type: "success",
        message: result.data ? result.data : "修改用户成功",
      });
      InfoStore.info.nickname = userInfo.value.nickname;
      InfoStore.info.email = userInfo.value.email;
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form
          :model="userInfo"
          :rules="rules"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
