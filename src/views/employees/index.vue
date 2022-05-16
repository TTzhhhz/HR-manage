<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">16条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示三个按钮 -->
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >excel导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" :data="List">
        <el-table-column label="序号" type="index" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column width="120px" label="头像" align="center">
          <!-- 这里要用到当前行元素的图片路径属性，所以要用作用域插槽 -->
          <template slot-scope="{ row }">
            <img
              v-imagerror="require('@/assets/common/head.jpg')"
              :src="row.staffPhoto"
              alt=""
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
              "
              @click="showTwoCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          sortable=""
          :formatter="formatEmployment"
        />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)"
              >角色</el-button
            >
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.size"
          :current-page="page.page"
          @current-change="changePage"
        ></el-pagination>
      </el-row>
    </div>
    <add-employee :showDialog.sync="showDialog"></add-employee>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
    <assign-role
      :showRoleDialog.sync="showRoleDialog"
      :userId="userId"
      ref="assignRole"
    ></assign-role>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees"; // 员工枚举对象
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
import AssignRole from "./components/assign-role.vue";
export default {
  components: {
    AddEmployee,
    AssignRole,
  },
  data() {
    return {
      List: [],
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: "",
    };
  },
  methods: {
    async editRole(id) {
      this.userId = id;
      // 这里为什么要加await 因为这个方法是一个异步方法，不加的话，可能弹层之后才会调用该方法，那么用户含有的角色打勾就会有闪烁的瞬间
      await this.$refs.assignRole.getUserDetailById(id); // 通过父组件调用子组件的方法，这时候用的id是父组件的
      this.showRoleDialog = true;
    },
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.List = rows;
      this.loading = false;
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("确定删除该员工吗");
        await delEmployee(id);
        this.getEmployeeList();
        this.$message("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },
    exportData() {
      // 转化数据结构，并且和表头的顺序对应。并且要求导出的表头是中文
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 通过懒加载的方式导出
      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.fromatJson(headers, rows);
        // 对rows进行格式上的转化
        // excel是引入文件的导出方法
        const multiHeader = [["姓名", "主要信息", "", "", "", "", ""]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          // 表头从哪里来
          header: Object.keys(headers),
          // 数据从哪里来,没有接口获取所有数据
          data: data,
          filename: "资料",
          bookType: "xlsx",
          multiHeader,
          merges,
        });
      });
    },
    fromatJson(headers, rows) {
      // headers主要是为了和表头对应
      return rows.map((item) => {
        return Object.keys(headers).map((keys) => {
          // 判断如果是时间字段
          if (
            headers[keys] === "timeOfEntry" ||
            headers[keys] === "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[keys]]);
          } else if (headers[keys] === "formOfEmployment") {
            console.log(EmployeeEnum.hireType);
            debugger;
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[keys]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[keys]];
        });
      });
    },
    showTwoCode(url) {
      // 只有url存在才弹出层，否则提示
      if (url) {
        this.showCodeDialog = true;
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url);
        });
      } else {
        this.$message.warning("此用户还未上传头像");
      }
    },
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style>
</style>