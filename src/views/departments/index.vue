<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 头部区域 -->
        <tree-tools :treeNode="company" :isRoot="true"></tree-tools>
        <!-- 内容区域 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 这里是通过作用域插槽实现，有多少节点就循环多少次 -->
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="delDepta"
          ></tree-tools>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments.js";
import { tranListToTreeData } from "@/utils";
export default {
  components: {
    TreeTools,
  },
  data() {
    return {
      company: {
        name: "",
        manager: "",
      },
      departs: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
    };
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人" };
      // 在这里把depts通过递归的方法把数组转化成树形结构
      this.departs = tranListToTreeData(result.depts, "");
    },
    delDepta() {
      // 自定义方法，重新获取一下data数据并转化成树形结构，可以直接调用上面getDepartments方法
      this.getDepartments();
    },
  },
  created() {
    this.getDepartments();
  },
};
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>