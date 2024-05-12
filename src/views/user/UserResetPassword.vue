<script setup>
import { ref } from "vue";
// import { updatePasswordService, userLoginService } from "@/api/user.js";
const checkPassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
    notUpdate.value = true;
  } else if (value !== passwordModel.value.newPassword) {
    callback(new Error("输入密码不一致"));
    notUpdate.value = true;
  } else {
    callback();
    notUpdate.value = false;
  }
};

const rules = {
  oldPassword: [
    { required: true, message: "请输入旧密码", trigger: "blur" },
    {
      pattern: /^\S{6,32}$/,
      message: "密码必须是6-32位的非空字符串",
      trigger: "blur",
    },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      pattern: /^\S{6,32}$/,
      message: "密码必须是6-32位的非空字符串",
      trigger: "blur",
    },
  ],
  repeatPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      pattern: /^\S{6,32}$/,
      message: "密码必须是6-32位的非空字符串",
      trigger: "blur",
    },
    { validator: checkPassword, trigger: "blur" },
  ],
};

const passwordModel = ref({
  oldPassword: "",
  newPassword: "",
  repeatPassword: "",
});


import { ElMessage, ElMessageBox } from "element-plus";
import { updatePasswordService } from "@/api/user";
import router from "@/router";
const notUpdate = ref(true);

const updatePassword = () => {
  ElMessageBox.confirm("确认修改密码？", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let result = await updatePasswordService(passwordModel.value);
    // let result = await updatePasswordService(passwordDate);
    router.push("/login")

    ElMessage({
      type: "success",
      message: result.data ? result.data : "修改密码成功,重新登入",
      // message: "修改密码成功",
    }).catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
  });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>修改密码</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form
          :model="passwordModel"
          :rules="rules"
          label-width="150px"
          size="large"
        >
          <el-form-item label="输入原始密码" prop="oldPassword">
            <el-input v-model="passwordModel.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="newPassword">
            <el-input v-model="passwordModel.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="再次输入新密码" prop="repeatPassword">
            <el-input v-model="passwordModel.repeatPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="notUpdate"
              @click="updatePassword"
              >提交修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
