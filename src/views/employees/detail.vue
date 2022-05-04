<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登陆账户设置">
            <el-form
              label-width="120px"
              style="width: 500px; margin-left: 120px; margin-top: 30px"
              :model="userInfo"
              :rules="rules"
              ref="userForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  type="password"
                  v-model="userInfo.password2"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 组件的另一种使用方式，使用is绑定,动态组件，可以切换组件 -->
            <component :is="userComponent"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="jobComponent"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info.vue";
import components from "@/components";
export default {
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      userComponent: "UserInfo",
      jobComponent: "JobInfo",
      userId: this.$route.params.id,
      userInfo: {
        username: "12",
        password2: "3", // 从后台获取的密码是密文，直接修改会把密码改成密文
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getUserDetailById() {
      console.log(this.userId);
      this.userInfo = await getUserDetailById(this.userId);
    },
    saveUser() {
      // 先要校验一下表单
      this.$refs.userForm.validate().then(async () => {
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        });
        this.$message("修改密码成功");
      });
    },
  },
  created() {
    this.getUserDetailById();
  },
};
</script>

<style>
</style>