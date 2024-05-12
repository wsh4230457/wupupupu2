<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
import {
  deleteCategoryService,
  updateCategoryService,
  findCategoryService,
  addCategoryService,
} from "@/api/article.js";
import { ElMessage, ElMessageBox } from "element-plus";
const categorys = ref([]);
const getCategoryData = async () => {
  let result = await findCategoryService();
  console.log(result.data);
  categorys.value = result.data;
};
const addCategoryData = async () => {
  console.log(categoryModel.value);

  let result = await addCategoryService(categoryModel.value);
  console.log(result.data);
  getCategoryData();
  ElMessage.success(result.message ? result.message : "添加成功");
};
const categoryModelClear = () => {
  categoryModel.value = {
    categoryName: "",
    categoryAlias: "",
  };
};
getCategoryData();
const dialogVisible = ref(false);
//添加分类数据模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});
//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
  ],
};
const title = ref("");
const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = "编辑分类";
  categoryModel.value.categoryAlias = row.categoryAlias;
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.id = row.id;
};
const updateCategory = async () => {
  let result = await updateCategoryService(categoryModel.value);
  ElMessage.success(result.message ? result.message : "修该分类成功");
  getCategoryData();
  dialogVisible.value = false;
};
const deleteCategory = (row) => {
  ElMessageBox.confirm(
    "将删除该文件分类. 要继续吗?",
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      let result = await deleteCategoryService(row.id);
      ElMessage({
        type: "success",
        message: result.message ? result.message : "Delete completed",
      });
      getCategoryData();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button
            type="primary"
            @click="
              dialogVisible = true;
              title = '添加分类';
            "
            >添加分类</el-button
          >
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            @click="showDialog(row)"
            :icon="Edit"
            circle
            plain
            type="primary"
          ></el-button>
          <el-button
            @click="deleteCategory(row)"
            :icon="Delete"
            circle
            plain
            type="danger"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </el-card>
  <el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form
      :model="categoryModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="categoryModel.categoryName"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input
          v-model="categoryModel.categoryAlias"
          minlength="1"
          maxlength="15"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          @click="
            title === '添加分类' ? addCategoryData() : updateCategory();
            categoryModelClear();
          "
          type="primary"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
