<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 防止设置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧 -->
            <el-row>
              <el-button type="primary" icon="el-icon-plus" size="small"
                >新增角色</el-button
              >
            </el-row>
            <el-table border>
              <el-table-column label="序号" width="120px"></el-table-column>
              <el-table-column label="角色" width="240px"></el-table-column>
              <el-table-column label="描述"></el-table-column>
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑权限</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              style="height: 60px"
              align="middle"
            >
              <!-- 防止分页组件 -->
              <el-pagination layout="prev, pager, next"></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="学校信息">
            <el-alert
              title="莫要去动这些信息，晓得不，彦祖"
              type="info"
              :closable="false"
              show-icon
            >
            </el-alert>
            <!-- 右侧 -->
            <el-form label-width="100px" style="margin-top: 30px" disabled>
              <el-form-item label="名称">
                <el-input style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input style="width: 400px"></el-input>
              </el-form-item>
              <el-form-item label="备注" type="textarea">
                <el-input
                  style="width: 400px"
                  type="textarea"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>