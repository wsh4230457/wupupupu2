<script setup>
import { Plus, Upload } from "@element-plus/icons-vue";
import { ref } from "vue";
import avatar from "@/assets/default.png";
const uploadRef = ref();
import { userInfoStore } from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
const infoStore = userInfoStore();
const tokenStore = useTokenStore();
console.log(infoStore.info.userPic);
//用户头像地址
const imgUrl = ref(infoStore.info.userPic);
const uploadSuccess = (result) => {
  imgUrl.value = result.data;
};
import { updateAvatarUrlService } from "@/api/user.js";
import { ElMessage, ElMessageBox } from "element-plus";
const updateAvatar = async () => {
  let result = await updateAvatarUrlService(imgUrl.value);
  if (result.code === 0) {
    infoStore.info.userPic = imgUrl.value;

    ElMessage({
      type: "success",
      message: result.data ? result.data : "修改用户头像成功",
    });
  } else {
    ElMessage({
      type: "info",
      message: result.data ? result.data : "修改用户头像失败",
    });
  }
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="true"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="uploadSuccess"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button
          @click="updateAvatar"
          type="success"
          :icon="Upload"
          size="large"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
