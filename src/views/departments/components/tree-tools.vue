<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-employees')"
                >添加</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments.js";
export default {
  props: {
    // 定义传入属性
    treeNode: {
      required: true,
      type: Object,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 点击编辑、删除和新增时触发
    operateDepts(type) {
      if (type === "add") {
        // 添加子部门
        // 自定义方法告诉父组件显示弹窗,传出treeNode是确定在哪个部门下添加子部门
        this.$emit("addDepts", this.treeNode);
      } else if (type === "edit") {
        // 编辑部门
        this.$emit("editDepts", this.treeNode);
      } else {
        // 删除部门
        // delDepartments(this.treeNode.id);
        // 先提示用户是否删除
        this.$confirm("您确定要删除吗")
          .then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            // 这时候只是调用接口删除了数据，页面并没有渲染，需要重新获取一下数据，通过自定义事件触发
            // 我不太理解这里为什么不处理错误，我的理解是只要打印了错误信息并提交到错误操作中就可以，不需要再操作
            this.$emit("delDepts");
            this.$message("删除成功");
          });
      }
    },
  },
};
</script>

<style>
</style>