<template>
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
// 按需引入echarts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, RadarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  RadarChart,
  LegendComponent,
]);

// 接下来的使用就跟之前一样，初始化图表，设置配置项
export default {
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv);
    myChart.setOption({
      title: {
        text: "基础雷达图",
      },
      legend: {
        data: ["Allocated Budget", "Actual Spending"],
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: "效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "学术", max: 100 },
          { name: "科研", max: 100 },
          { name: "带课", max: 100 },
          { name: "论文", max: 100 },
        ],
      },
      series: [
        {
          name: "预算 vs 开销",
          type: "radar",
          data: [
            {
              value: [10, 20, 30, 40, 50, 60],
              name: "张三",
            },
            {
              value: [90, 80, 70, 30, 20, 10],
              name: "李四",
            },
          ],
        },
      ],
    });
  },
};
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>