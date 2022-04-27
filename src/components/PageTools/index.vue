<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 左插槽 -->
        <div v-if="showBefore" class="before">
          <i class="el-icon-info"></i>
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <!-- 右插槽 -->
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    // 通过自定义属性让父组件控制左侧的显示和隐藏
    showBefore: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
.page-tools {
  margin: 10px 0;
  .before {
    line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>