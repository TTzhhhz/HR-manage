<template>
  <upload-excel :on-success="success"></upload-excel>
</template>

<script>
import { importEmployee } from "@/api/employees";
export default {
  methods: {
    async success({ header, results }) {
      // 要把header和results中的数据转化为英文
      // username: "", 对应用户名
      // mobile: "",  手机号
      // formOfEmployment: "",
      // workNumber: "", 工号
      // departmentName: "",
      // timeOfEntry: "", 入职日期
      // correctionTime: "", 转正日期
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      // var arr = [];
      // results.forEach((item) => {
      //   var userInfo = {};
      //   Object.keys(item).forEach((key) => {
      //     userInfo[userRelations[key]] = item[key];
      //   });
      //   arr.push(userInfo);
      // });
      var newArr = results.map((item) => {
        var userInfo = {};
        Object.keys(item).forEach((key) => {
          // 在转化的时候先判断是不是日期，是日期需要进行处理再存入
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            // 后端接口限制不能是字符串，要求转化成时间类型
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/") // 这样才能入库
            );
          } else {
            userInfo[userRelations[key]] = item[key];
          }
        });
        return userInfo;
      });
      await importEmployee(newArr);
      this.$message("导入excel成功");
      this.$router.back(); // 回到上一个路由页面
    },
    // js接收到的日期格式和excel中的不一样，进行格式的转换
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style>
</style>