<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- row-key是list中元素的唯一标识符 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column
          label="标识"
          align="center"
          prop="code"
        ></el-table-column>
        <el-table-column
          label="描述"
          align="center"
          prop="description"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <!-- 添加按钮只在访问权显示，按钮操作权隐藏，根据返回的type操作 -->
            <el-button
              type="text"
              v-if="row.type === 1"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form
        label-width="120px"
        :rules="rules"
        :model="formData"
        ref="permForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input style="width: 60%" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input style="width: 60%" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            style="width: 60%"
            v-model="formData.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail,
} from "@/api/permission";
import { tranListToTreeData } from "@/utils";
export default {
  computed: {
    showText() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [{ required: true, message: "权限名不能为空" }],
        code: [{ required: true, message: "标识不能为空" }],
      },
    };
  },
  methods: {
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    btnOK() {
      // 通过formData中是否有ID确认是新增还是编辑
      this.$refs.permForm
        .validate()
        .then(() => {
          // 校验成功
          if (this.formData.id) {
            // 编辑
            return updatePermission(this.formData);
          } else {
            return addPermission(this.formData);
          }
        })
        .then(() => {
          // 添加成功
          this.$message.success("操作成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      // 清空表单数据
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      // 移除校验规则
      this.$refs.permForm.resetFields();
      // 关闭弹层
      this.showDialog = false;
    },
    addPermission(type, pid) {
      // type表示添加访问权还是按钮操作权限,pid表示添加权限的对象
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },
    delPermission(id) {
      this.$confirm("确认删除该权限吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          // 重新拉数据渲染
          this.getPermissionList();
        });
    },
    async getPermissionList() {
      // 数组转化成带children的树形结构，函数之前封装过
      this.list = tranListToTreeData(await getPermissionList(), 0);
    },
  },
  created() {
    this.getPermissionList();
  },
};
</script>

<style>
</style>