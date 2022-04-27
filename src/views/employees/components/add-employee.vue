<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="addEmployee"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 50%"
          placeholder="请选择聘用形式"
          v-model="formData.formOfEmployment"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width: 50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        ></el-input>
        <el-tree
          :data="treeData"
          :props="{ label: 'name' }"
          default-expand-all
          v-if="showTree"
          v-loading="loading"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          placeholder="情选择转正时间"
          v-model="formData.correctionTime"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" slot="footer">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import EmployeeEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EmployeeEnum,
      loading: false,
      showTree: false,
      treeData: [],
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          { min: 1, max: 4, message: "用户姓名为1-4位", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  methods: {
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false;
    },
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
    btnCancel() {
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs.addEmployee.resetFields(); // 移除校验
      this.$emit("update:showDialog", false);
    },
    async btnOK() {
      // 手动校验表单
      try {
        await this.$refs.addEmployee.validate();
        // 调用新增接口
        await addEmployee(this.formData);
        // 令父组件重新渲染数据，可以用自定义方法，也可以用$parent父组件的实例
        this.$parent.getEmployeeList && this.$parent.getEmployeeList();
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>