<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 头部区域 -->
        <tree-tools
          :treeNode="company"
          :isRoot="true"
          @addDepts="addDepts"
        ></tree-tools>
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
            @addDepts="addDepts"
            @editDepts="editDepts"
          ></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <!-- 防止弹层组件 -->
    <add-dept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments.js";
import { tranListToTreeData } from "@/utils";
import AddDept from "./components/add-dept.vue";
export default {
  components: {
    TreeTools,
    AddDept,
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
      showDialog: false,
      node: null, //记录当前点击添加的节点
    };
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      // 在这里把depts通过递归的方法把数组转化成树形结构
      this.departs = tranListToTreeData(result.depts, "");
    },
    delDepta() {
      // 自定义方法，重新获取一下data数据并转化成树形结构，可以直接调用上面getDepartments方法
      this.getDepartments();
    },
    addDepts(node) {
      // 自定义方法，展示弹窗
      this.showDialog = true;
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      // 弹窗后要把数据显示在表单
      this.$refs.addDept.getDepartDetail(node.id);
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