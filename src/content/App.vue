<template>
  <el-dialog title="提交到 Navigation" :visible.sync="dialogVisible" width="400px" top="10px" :append-to-body="true"
    :close-on-click-modal="false" :show-close="false">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="网站名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：navigation-web" />
      </el-form-item>
      <el-form-item label="网站分类" prop="category">
        <el-select v-model="ruleForm.category" placeholder="请选择网站分类" allow-create filterable default-first-option>
          <el-option v-for="(item,key) in categoryOptions" :key="key" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="网站链接" prop="website">
        <el-input v-model="ruleForm.website" placeholder="例如：http://navigation.qiufeihong.top" />
      </el-form-item>
      <el-form-item label="网站图片" prop="logo">
        <el-input v-model="ruleForm.logo" placeholder="例如：http://navigation.qiufeihong.top/favicon.ico" />
      </el-form-item>
      <el-form-item label="网站描述" prop="describe">
        <el-input v-model="ruleForm.describe" type="textarea" placeholder="例如：一个网站导航和收藏平台（请用中文）" />
      </el-form-item>
      <el-form-item>
        <el-button class="btn-container" type="info" @click="getPicture()">是否截取首屏作为网站图片</el-button>
        <div class="btn-container">
          <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
          <el-button type="warning" @click="resetForm('ruleForm')">重 置</el-button>
          <el-button type="danger" @click="close('ruleForm')">取 消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  // 爬虫
  import crawler from './utils/crawler'
  // 前后端通信
  import service from './plugin/axios'
  // 网站种类
  import * as categoryOptions from './categoryOptions'
  // 截图
  // https://github.com/niklasvh/html2canvas
  import html2canvas from 'html2canvas'
  // 存储对象
  import OSS from 'ali-oss'
  // 导入局部notification，防止全局出现的bug
  import CryptoJS from 'crypto-js'
  import {
    Notification
  } from 'element-ui'
  export default {
    name: 'app',
    data() {
      return {
        dialogVisible: false,
        // 提交表单
        ruleForm: {},
        // 校验
        rules: {
          name: [{
            required: true,
            message: '请输入网站名称',
            trigger: 'blur'
          }],
          category: [{
            required: true,
            message: '请选择网站分类',
            trigger: 'change'
          }],
          website: [{
            required: true,
            message: '请输入网站链接',
            trigger: 'blur'
          }]
        },
        categoryOptions,
        tokenParams: {
          accessKey: 'vNBgV03wzBamr-cuCPnzR9YCbRnDnG8q4_Zu09W1',
          secretKey: 'fcfSDL_K0psTP53q3RQI_fFutztytMgY1HeVH-3K',
          putPolicy: 'qiufeihong'
        }
      }
    },
    methods: {
      /**
       * 接收消息
       */
      onMessage({
        action
      }) {
        const data = {
          // 页面信息
          ...crawler(),
          way: 'add',
          category: '',
          logo: ''
        }
        this.ruleForm = data
        this.dialogVisible = true
      },
      /**
       * 关闭弹框
       */
      close(formName) {
        this.$refs[formName].resetFields()
        this.dialogVisible = false
      },
      /**
       * 方案一:截取网站首屏,存储阿里云OSS
       *    https://ask.csdn.net/questions/674754
       * 方案二:截取网站首屏,存储七牛云
       *    https://developer.qiniu.com/kodo/kb/1326/how-to-upload-photos-to-seven-niuyun-base64-code
       */
      getPicture() {
        html2canvas(document.body).then(canvas => {
          // document.body.appendChild(canvas);
          const dataUrl = canvas.toDataURL('image/png')
          // console.log(dataUrl)
          this.putb64(dataUrl)
          // // 1. 将dataUrl转化为Blob
          // const blob = this.base64ToBlob(dataUrl)
          // // console.log(blob)
          // // 2. 上传到oss
          // this.uploadShareImg(blob)
        })
      },
      base64encode(str) {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = str.charCodeAt(i++);
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
          }
          c3 = str.charCodeAt(i++);
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
          out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
      },
      /* utf.js - UTF-8 <=> UTF-16 convertion
       *
       * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
       * Version: 1.0
       * LastModified: Dec 25 1999
       * This library is free. You can redistribute it and/or modify it.
       */
      /*
       * Interfaces:
       * utf8 = utf16to8(utf16);
       * utf16 = utf8to16(utf8);
       */
      utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      },
      safe64(base64) {
        base64 = base64.replace(/\+/g, "-");
        base64 = base64.replace(/\//g, "_");
        return base64;
      },
      // http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken
      genUpToken(accessKey, secretKey, putPolicy) {
        // 1.构造上传策略：
        //SETP 2.将上传策略序列化成为JSON：
        var put_policy = JSON.stringify(putPolicy);
        console && console.log("put_policy = ", put_policy);

        //SETP 3.对 JSON 编码的上传策略进行URL 安全的 Base64 编码，得到待签名字符串：
        var encoded = this.base64encode(this.utf16to8(put_policy));
        console && console.log("encoded = ", encoded);

        //SETP 4.使用访问密钥（AK/SK）对上一步生成的待签名字符串计算HMAC-SHA1签名：
        var hash = CryptoJS.HmacSHA1(encoded, secretKey);
        var encoded_signed = hash.toString(CryptoJS.enc.Base64);
        console && console.log("encoded_signed=", encoded_signed)

        //SETP 5.对签名进行URL安全的Base64编码：
        var upload_token = accessKey + ":" + this.safe64(encoded_signed) + ":" + encoded;
        console && console.log("upload_token=", upload_token)
        return upload_token;
      },
      putb64(pic) {
        var url = "https://upload.qiniup.com/putb64/-1"; //非华东空间需要根据注意事项 1 修改上传域名
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            console.log('responseText', xhr.responseText)
            console.log('ruleForm', this.ruleForm)
            // this.ruleForm.logo = xhr.responseText;
          }
        }
        // https://www.w3school.com.cn/ajax/ajax_xmlhttprequest_onreadystatechange.asp
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        // xhr.setRequestHeader("Authorization", this.genUpToken(this.tokenParams.accessKey, this.tokenParams.secretKey,
          // this.tokenParams.putPolicy));
        xhr.setRequestHeader("Authorization", 'vNBgV03wzBamr-cuCPnzR9YCbRnDnG8q4_Zu09W1:aeD8jxzBQVzfeGh7SmEL70SuJJA=:eyJzY29wZSI6InFpdWZlaWhvbmciLCJkZWFkbGluZSI6MTU3MTgxODI0NX0=');
        xhr.send(pic);
      },
      // // base64转换成blob数据
      // base64ToBlob(dataUrl, type) {
      //   var arr = dataUrl.split(',')
      //   var mime = arr[0].match(/:(.*?);/)[1] || type
      //   // 去掉url的头，并转化为byte
      //   var bytes = window.atob(arr[1])
      //   // 处理异常,将ascii码小于0的转换为大于0
      //   var ab = new ArrayBuffer(bytes.length)
      //   // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      //   var ia = new Uint8Array(ab)
      //   for (var i = 0; i < bytes.length; i++) {
      //     ia[i] = bytes.charCodeAt(i)
      //   }
      //   return new Blob([ab], {
      //     type: mime
      //   })
      // },
      // // 上传Blob二进制数据
      // uploadBlob(fileName, blob) {
      //   return new Promise((resolve, reject) => {
      //     let ossClient = new OSS({
      //       region: 'navigation-html2canvas.oss-cn-hangzhou.aliyuncs.com',
      //       // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
      //       accessKeyId: 'LTAI4FwUEemm2DtdGVzyMft7',
      //       accessKeySecret: 'ALm9YYpBohSWdBBhTdA9UPBmjYkSxV',
      //       bucket: 'navigation-html2canvas'
      //     })
      //     async function putBlob() {
      //       try {
      //         console.log('ossClient', ossClient)
      //         let result = await ossClient.put(fileName, blob)
      //         console.log('result', result)
      //         // result.imgUrl = `${CDN_IMAGE_DOMAIN}/${result.name}`;
      //         resolve(result)
      //       } catch (e) {
      //         reject(e)
      //       }
      //     }
      //     putBlob()
      //   })
      // },
      // // 上传分享大图
      // uploadShareImg(blob) {
      //   const fileName = `logo/${this.ruleForm.name}-${Math.round(new Date().getTime() / 1000)}.jpg`
      //   // console.log(fileName)
      //   this.uploadBlob(fileName, blob).then(res => {
      //     this.ruleForm.logo = res.imgUrl
      //   })
      // },
      /**
       * @description 提交登录信息
       */
      submitForm(formName) {
        // console.log(this.ruleForm)
        this.$refs[formName].validate(async valid => {
          if (valid) {
            service({
                url: '/api/v1/admin/',
                method: 'post',
                data: this.ruleForm
              })
              .then(res => {
                if (res.data.state === 'ok') {
                  Notification.success({
                    title: '成功',
                    message: `提交网站《${this.ruleForm.name}》成功`
                  })
                } else {
                  Notification.error({
                    title: '失败',
                    message: `提交网站《${this.ruleForm.name}》失败-${res.data.message}`
                  })
                }
              })
          } else {
            Notification.error({
              title: '表单校验失败',
              message: '请填上必填信息'
            })
          }
        })
      },
      /**
       * 重置数据
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="scss">
  .btn-container {
    white-space: nowrap;
    float: right;
    margin-bottom: 10px;
  }

  .el-input__inner {
    width: 260px;
  }
</style>
