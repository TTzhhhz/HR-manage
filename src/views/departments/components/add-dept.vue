<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="deptForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <!-- 通过对people遍历循环生成选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row type="flex" justify="center" slot="footer">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments.js";
import { getEmployeeSimple } from "@/api/employees.js";
export default {
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  props: {
    showDialog: { type: Boolean, default: false },
    treeNode: { type: Object, default: null },
  },
  methods: {
    // 定义获取部门具体信息的函数，在点击编辑后调用
    async getDepartDetail(id) {
      // 这里参数为什么不能写this.treeNode.id ，因为props是异步的，可能还没传到子组件
      this.formData = await getDepartDetail(id);
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    btnOK() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          // 点击确定进行场景区分（根据formdata有无id）
          if (this.formData.id) {
            // 有id为编辑功能
            await updateDepartments(this.formData);
          } else {
            // 表单校验通过,要把当前元素节点的id作为子部门的pid发送到后台，表明要添加这个部门下的新部门
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          // 后台新增或者编辑之后，父组件要重新拉数据
          this.$emit("addDepts");
          // 关闭dialog时会自动触发close事件，所以这里不再单独清除数据
          this.$emit("update:showDialog", false);
        }
      });
    },
    btnCancel() {
      // 这里为什么要重新给formData赋值一次呢，因为我们在编辑部门的时候给formData赋值了id属性
      // 而下面的resetFields方法只能重置表单里面的属性，这样会导致点击了编辑部门之后formdata中
      // 还有id属性，这时点击新增部门还会显示编辑
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      // 点击取消关闭弹层,并且要先清除表单中的数据
      this.$refs.deptForm.resetFields();
      this.$emit("update:showDialog", false);
    },
  },
  data() {
    // 检查部门名字是否重复（需要区分编辑还是新增）
    const checkNameRepeat = async (rule, value, callback) => {
      // value是校验对象，要和同级部门下的部门比，如果名字相同，校验失败，不相同，校验成功
      //这里要立即获取一下最新的部门数据，因为其他人有可能已经添加过了
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 有id为编辑模式
        // 规则：name不能和同级别部门名字相同，先根据pid筛选出找到除取自身的同级别部门
        isRepeat = depts
          .filter(
            (item) =>
              item.id !== this.treeNode.id && item.pid === this.formData.pid
          )
          .some((item) => item.name === this.formData.name);
      } else {
        // 无id为新增模式
        // 找到所有的pid为当前节点的id的子部门
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      // 如果isRepeat为ture表示有重复的名字
      isRepeat ? callback(new Error("该部门已存在")) : callback();
    };
    // 检查部门编码是否重复，这里就不需要筛选子部门了
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 编辑模式
        // 规则：除了自身不能有同样的code
        debugger;
        isRepeat = depts
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code === this.formData.code);
      } else {
        // 新增模式
        // 不需要筛选出子部门了,这里历史数据可能code为空，多加一个判断(我不觉得不需要，因为编码的上一条规则已经定义是在1-50的了，是不是为了防止输空格)
        isRepeat = depts.some((item) => item.code === value && value);
      }
      // 如果isRepeat为ture表示有重复的名字
      isRepeat ? callback(new Error("编码已经存在")) : callback();
    };
    return {
      peoples: [],
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "部门管理人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>

<style>
</style>