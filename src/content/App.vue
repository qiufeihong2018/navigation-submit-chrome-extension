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
      <el-form-item label="网站LOGO" prop="logo">
        <el-input v-model="ruleForm.logo" placeholder="例如：http://navigation.qiufeihong.top/favicon.ico" />
      </el-form-item>
      <el-form-item label="网站描述" prop="describe">
        <el-input v-model="ruleForm.describe" type="textarea" placeholder="例如：一个网站导航和收藏平台（请用中文）" />
      </el-form-item>
      <el-form-item>
        <div class="btn-container">
          <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
          <el-button @click="resetForm('ruleForm')">重 置</el-button>
          <el-button @click="close('ruleForm')">取 消</el-button>
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
  // 导入局部notification，防止全局出现的bug
  import {
    Notification
  } from 'element-ui'
  export default {
    name: 'app',
    data() {
      return {
        dialogVisible: false,
        // 提交表单
        ruleForm: {
          name: '',
          category: '',
          website: '',
          describe: '',
          logo: '',
          way: 'add'
        },
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
        categoryOptions
      }
    },
    methods: {
      /**
       * 关闭弹框
       */
      close(formName) {
        this.$refs[formName].resetFields()
        this.dialogVisible = false
      },
      /**
       * @description 提交登录信息
       */
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            if (this.ruleForm.logo === '') {
              this.ruleForm.logo = 'http://navigation.qiufeihong.top/favicon.ico'
            }
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
      },
      /**
       * 接收消息
       */
      onMessage({
        action
      }) {
        const data = {
          // 页面信息
          ...crawler(),
          way: 'add'
        }
        // console.log(data)
        this.ruleForm = data

        this.dialogVisible = true
      }
    }
  }
</script>
<style lang="scss">
  .btn-container {
    white-space: nowrap;
    margin-left: -100px;
  }

  .el-input__inner {
    width: 260px;
  }
</style>