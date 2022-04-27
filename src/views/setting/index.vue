<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 防止设置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧 -->
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-table border :data="roleList">
              <el-table-column
                label="序号"
                width="120px"
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="角色"
                width="240px"
                prop="name"
              ></el-table-column>
              <el-table-column
                label="描述"
                prop="description"
              ></el-table-column>
              <el-table-column label="操作">
                <!-- 通过作用域插槽传递点击的按钮的id -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="deleteRole()"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              style="height: 60px"
              align="middle"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="学校信息">
            <el-alert
              title="莫要去动这些信息，晓得不"
              type="info"
              :closable="false"
              show-icon
            >
            </el-alert>
            <!-- 右侧 -->
            <el-form label-width="100px" style="margin-top: 30px" disabled>
              <el-form-item label="名称">
                <el-input
                  style="width: 400px"
                  v-model="formData.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input
                  style="width: 400px"
                  v-model="formData.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  style="width: 400px"
                  v-model="formData.companyPhone"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  style="width: 400px"
                  v-model="formData.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注" type="textarea">
                <el-input
                  style="width: 400px"
                  type="textarea"
                  :rows="3"
                  v-model="formData.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 防止弹层用于编辑和新增 -->
    <el-dialog :visible="showDialog" title="编辑部门" @close="btnCancle">
      <el-form
        label-width="120px"
        :model="roleFrom"
        :rules="rules"
        ref="roleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleFrom.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确定和取消按钮 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancle">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入获取角色信息的api
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
} from "@/api/setting.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      roleList: [],
      page: {
        // 防止页码以及相关数据，作为getRoleList的查询参数,要和分页组件进行绑定
        page: 1,
        pagesize: 9,
        total: 0,
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 控制弹层显示
      roleFrom: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    // 定义方法调用getRoleList
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.roleList = rows;
    },
    changePage(newPage) {
      // newPage是分页组件当前点击的页码的值
      console.log(newPage);
      this.page.page = newPage; // 把点击的页码传给page.page
      // 根据页码重新获取后台数据并渲染
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
      debugger;
      console.log(this.formData);
    },
    async deleteRole(id) {
      // 先提示是否删除
      try {
        await this.$confirm("确认删除该角色吗");
        // 只有点击了确定后才会继续执行,使用删除接口
        await deleteRole(id);
        // 更新前端数据，这里更新数据的方法我觉得需要加await强制等待
        this.getRoleList();
        this.$message("删除成功");
      } catch (error) {}
    },
    async editRole(id) {
      this.roleFrom = await getRoleDetail(id);
      this.showDialog = true; // 展示弹层
    },
    btnCancle() {
      this.roleFrom = {
        name: "",
        description: "",
      };
      // 清空校验规则
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    async btnOk() {
      // 点击确定,校验表单-提交表单
      try {
        await this.$refs.roleForm.validate(); // 这里用await时因为饿了么组件2.13.2中说如果没有回掉函数会返回一个Promise对象
        // 根据roleForm是否有id判断时新增还是删除，有id为编辑，无id为新增
        if (this.roleFrom.id) {
          //  执行编辑
          // 调用更新接口
          await updateRole(this.roleFrom);
          // 重新渲染页面
          this.getRoleList();
        } else {
          // 执行新增
          await addRole(this.roleFrom);
        }
        this.$message("编辑成功");
        this.showDialog = false; // 关闭弹层
      } catch (error) {
        console.log("校验失败");
      }
    },
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
};
</script>

<style>
</style>