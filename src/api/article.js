import request from "@/utils/request.js";
export const findCategoryService = () => {
  return request.get("/category/findCategory");
};
export const addCategoryService = (categoryData) => {
  return request.post("/category/addCategory", categoryData);
};
export const updateCategoryService = (categoryData) => {
  return request.put("/category/updateCategory", categoryData);
};
export const deleteCategoryService = (id) => {
  return request.delete("/category/deleteCategory?id=" + id);
};
export const articleListService = (params) => {
  return request.get("/article/list", { params: params });
};
export const addArticleService = (articleData) => {
  return request.post("/article/addArticle", articleData);
};
