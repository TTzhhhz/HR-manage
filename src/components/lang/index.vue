<template>
  <el-dropdown @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'"
        >中文</el-dropdown-item
      >
      <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'"
        >En</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from "js-cookie";
export default {
  methods: {
    changeLanguage(command) {
      // 要把command写到cookie
      Cookie.set("language", command);
      // 改变多语言类型,这里我不是很清楚，不是已经在cookie中存了对应的language吗
      // 我的想法是他只有初始会读取cookie，如果cookie他不会重新读，需要重新赋值，那为什么还要存到cookie主要是为了刷新时记住原先的语言
      this.$i18n.locale = command;
      this.$message.success("切换多语言成功");
    },
  },
};
</script>

<style>
</style>