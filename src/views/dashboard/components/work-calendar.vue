<template>
  <!-- 工作日历组件 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select
        size="small"
        style="width: 100px"
        v-model="currentYear"
        @change="dataChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        size="small"
        style="width: 100px; margin-left: 10px"
        v-model="currentMonth"
        @change="dataChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- date是当前单元格日期，data是一个包含多个数据的对象 -->
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      yearList: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null,
    };
  },
  props: {
    startDate: {
      type: Date,
      // 回掉函数式的返回值
      default: () => new Date(),
    },
  },
  filters: {
    getDay(value) {
      const day = value.split("-")[2];
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
  methods: {
    dataChange() {
      // 当select选中数据变化后，触发该函数，改变日期组件绑定的currentDate
      // alert(this.currentYear);
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`);
    },
    isWeek(date) {
      // 判断当前是否是周末
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
  created() {
    this.currentYear = this.startDate.getFullYear();
    this.currentMonth = this.startDate.getMonth() + 1;
    // 快速生成数组的方法
    this.yearList = Array.from(
      Array(11),
      (value, index) => index + this.currentYear - 5
    );
    // 初始化的时候也需要给一个日历事件
    this.dataChange();
  },
};
</script>

<style  scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>