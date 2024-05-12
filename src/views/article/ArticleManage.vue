<script setup>
import { Edit, Delete, Plus } from "@element-plus/icons-vue";

import { ref } from "vue";
import {
  addArticleService,
  articleListService,
  findCategoryService,
  updateArticleService,
  deleteArticleService,
} from "@/api/article.js";
import { ElMessage, ElMessageBox } from "element-plus";
//文章分类数据模型
const categorys = ref([]);
const categoryList = async () => {
  let result = await findCategoryService();
  categorys.value = result.data;
};

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const state = ref("");

//文章列表数据模型
const articles = ref([]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  articleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  articleList();
};
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let result = await articleListService(params);

  articles.value = result.data.items;
  for (let index = 0; index < articles.value.length; index++) {
    let article = articles.value[index];
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryBelongs === categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName;
      }
    }
  }
  total.value = result.data.total;
};
categoryList();
articleList();
//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
  title: "",
  categoryBelongs: "",
  coverImg: "",
  content: "",
  state: "",
});
const articleModelClear = () => {
  articleModel.value = {
    title: "",
    categoryBelongs: "",
    coverImg: "",
    content: "",
    state: "",
  };
};
const title = ref("");
const addArticle = async () => {
  console.log(articleModel.value);
  let result = await addArticleService(articleModel.value);
  ElMessage.success(result.data ? result.data : "添加文章成功");
  visibleDrawer.value = false;
  articleModelClear();
  articleList();
};
const showDrawer = (row) => {
  title.value = "修改文章";
  visibleDrawer.value = true;
  articleModel.value.title = row.title;
  articleModel.value.id = row.id;
  articleModel.value.content = row.content;
  articleModel.value.coverImg = row.coverImg;
  articleModel.value.state = row.state;
  articleModel.value.categoryBelongs = row.categoryBelongs;
};
const updateArticle = async () => {
  console.log(articleModel.value);
  let result = await updateArticleService(articleModel.value);
  ElMessage.success(result.data ? result.data : "修改文章成功");
  visibleDrawer.value = false;
  articleModelClear();
  articleList();
};
const deleteArticle = (row) => {
  ElMessageBox.confirm("确定删除吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log(row.id);
      let result = await deleteArticleService(row.id);

      ElMessage({
        type: "success",
        message: result.data ? result.data : "删除文章成功",
      });
      visibleDrawer.value = false;
      articleModelClear();
      articleList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useTokenStore } from "@/stores/token";

// 文章封面上传
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
};
const tokenStore = useTokenStore();
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button
            @click="
              visibleDrawer = true;
              title = '添加文章';
            "
            type="primary"
            >添加文章</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <el-button
          @click="
            categoryId = '';
            state = '';
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="文章标题"
        width="400"
        prop="title"
      ></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            @click="showDrawer(row)"
            :icon="Edit"
            circle
            plain
            type="primary"
          ></el-button>
          <el-button @click="deleteArticle(row)" :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </el-card>

  <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
    <!-- 添加文章表单 -->
    <el-form :model="articleModel" label-width="100px">
      <el-form-item label="文章标题">
        <el-input
          v-model="articleModel.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <el-select placeholder="请选择" v-model="articleModel.categoryBelongs">
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章封面">
        <el-upload
          class="avatar-uploader"
          :auto-upload="true"
          :show-file-list="false"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="uploadSuccess"
        >
          <img
            v-if="articleModel.coverImg"
            :src="articleModel.coverImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="articleModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="
            articleModel.state = '已发布';
            title === '添加文章' ? addArticle() : updateArticle();
          "
          >发布</el-button
        >
        <el-button
          type="info"
          @click="
            articleModel.state = '草稿';
            title === '添加文章' ? addArticle() : updateArticle();
          "
          >草稿</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
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
  .el-select {
    --el-select-width: 220px;
  }
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
