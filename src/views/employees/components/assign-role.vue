<template>
  <el-dialog title="分配权限" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 显示的是角色名称，存储的是角色id -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      list: [], // 存储是从后台获取的所有角色的id
      roleIds: [], // 用来存储当前用户所拥有的角色id
    };
  },
  methods: {
    btnOK() {
      assignRoles({ id: this.userId, roleIds: this.roleIds });
      // 关闭弹层
      this.$emit("update:showRoleDialog", false);
    },
    btnCancel() {
      this.roleIds = [];
      this.$emit("update:showRoleDialog", false);
    },
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, size: 20 });
      this.list = rows;
    },
    // 通过父组件调用该方法
    async getUserDetailById(id) {
      // 这里为什么不能用userId，要点击角色之后才能调用该方法，因为props赋值是异步的,可能弹窗之后userId还没得到值
      // userId可能没得到值为null，无法作为参数，所以不能用this.userId
      const { roleIds } = await getUserDetailById(id);
      // 把用户所拥有的角色赋值给roleIds
      this.roleIds = roleIds;
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style>
</style>