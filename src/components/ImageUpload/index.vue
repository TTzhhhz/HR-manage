<template>
  <div>
    <!-- file-list是上传文件列表，让文件显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="changeFile"
      :http-request="upload"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      style="width: 180px"
      :percentage="currentPercent"
      v-if="showPercent"
    ></el-progress>
    <el-dialog :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5"; // 引入腾讯云的cos包
const cos = new COS({
  SecretId: "AKIDWu52kETUGn58wVpukKflcEcleKlwsZ1E",
  SecretKey: "0lHYaMtBG8l9ICqFQL1SdZGjyxjHaeT2",
});
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: "",
      currentFileUid: null, //记录当前正在上传的文件的uid
      showPercent: false,
      currentPercent: 0,
    };
  },
  methods: {
    preview(file) {
      this.showDialog = true;
      this.imgUrl = file.url;
    },
    remove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      // console.log(this.fileList);
      // this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
      this.fileList = fileList; // fileList是this.fileList删除对应元素的新数组
    },
    changeFile(file, fileList) {
      // 这里他会执行两次，添加一次，上传失败一次，失败后fileList就是空了  所以显示不了，需要先上传到腾讯云
      // 上传到云服务器先对文件进行检查
      this.fileList = fileList.map((item) => item);
    },
    beforeUpload(file) {
      // console.log(file);
      // 先检查文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        this.$message.error("文件格式要求精品jpg gif bmp png格式");
        return false;
      }
      // 再检查文件大小,限制最大5M,js中是以bit的形式显示
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("文件不能超过5M");
        return false;
      }
      this.currentFileUid = file.uid;
      // 显示进度条
      this.showPercent = true;
      return true;
    },
    upload(params) {
      if (params.file) {
        // 文件存在，进行上传操作
        cos.putObject(
          {
            Bucket: "xiaoxin-1311667203", // 存储桶名称
            Region: "ap-chongqing", // 存储桶地狱
            Key: params.file.name, // 唯一标识符
            Body: params.file, // 要上传的文件
            StorageClass: "STANDARD", // 必填项，标准模式
            onProgress: (params) => {
              // 这里主要是获取文件上传进度的百分比
              this.currentPercent = params.percent * 100;
            },
          },
          (err, data) => {
            // console.log(err || data);
            // data中包含该文件的地址，为腾讯云服务器返回。status状态码200表示上传成功
            if (!err && data.statusCode === 200) {
              // 文件上传成功，获取返回的文件地址
              // 当前设置的是一个图片，如果是设置多个图片，需要知道上传成功的是哪一张图片
              // 这里我其实有点难以理解，吧url替换成服务器地址后返回，为什么他的fileList里面还有uid，map返回的对象又没有uid，不会覆盖掉吗
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  return { url: "https://" + data.Location, upload: true };
                } else {
                  return item;
                }
              });
            }
            // 上传成功，关闭进度条，重制百分比,直接这样设置进度条太快就没了
            setTimeout(() => {
              this.showPercent = false;
              this.currentPercent = 0;
            }, 1000);
          }
        );
      }
    },
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>