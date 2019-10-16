<style lang="scss">
  .btn-container {
    white-space: nowrap;
    margin-left: -100px;
  }

  .el-input__inner {
    width: 260px;
  }
</style>


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
  import crawler from './utils/crawler'
  import service from './plugin/axios'
  import {
    Notification
  } from 'element-ui'
  export default {
    name: 'app',
    data() {
      return {
        dialogVisible: false,
        ruleForm: {
          name: '',
          category: '',
          website: '',
          describe: '',
          logo: '',
          way: 'add'
        },
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
        categoryOptions: [{
          "value": "recommendationFront-end",
          "label": "前端-热门推荐"
        }, {
          "value": "frontFrameFront-end",
          "label": "前端-前端框架"
        }, {
          "value": "forumCommunityFront-end",
          "label": "前端-论坛社区"
        }, {
          "value": "learningPlatformFront-end",
          "label": "前端-学习平台"
        }, {
          "value": "onlineProgrammingFront-end",
          "label": "前端-在线编程"
        }, {
          "value": "javaScriptFrameworkFront-end",
          "label": "前端-JavaScript框架"
        }, {
          "value": "codeHostingFront-end",
          "label": "前端-代码托管"
        }, {
          "value": "inspectionTestFront-end",
          "label": "前端-检查测试"
        }, {
          "value": "CSSFrameworkFront-end",
          "label": "前端-CSS框架"
        }, {
          "value": "techDocFront-end",
          "label": "前端-技术文档"
        }, {
          "value": "buildToolFront-end",
          "label": "前端-构建工具"
        }, {
          "value": "blogFront-end",
          "label": "前端-技术博客"
        }, {
          "value": "githubRepositoryFront-end",
          "label": "前端-Github仓库"
        }, {
          "value": "recommendationBack-end",
          "label": "后端-热门推荐"
        }, {
          "value": "frontFrameBack-end",
          "label": "后端-后端框架"
        }, {
          "value": "forumCommunityBack-end",
          "label": "后端-论坛社区"
        }, {
          "value": "learningPlatformBack-end",
          "label": "后端-学习平台"
        }, {
          "value": "onlineProgrammingBack-end",
          "label": "后端-在线编程"
        }, {
          "value": "personalFrameworkBack-end",
          "label": "后端-个人框架"
        }, {
          "value": "codeHostingBack-end",
          "label": "后端-代码托管"
        }, {
          "value": "inspectionTestBack-end",
          "label": "后端-检查测试"
        }, {
          "value": "contentManagementBack-end",
          "label": "后端-内容管理"
        }, {
          "value": "buildToolBack-end",
          "label": "后端-构建工具"
        }, {
          "value": "recommendationDesign",
          "label": "设计-热门推荐"
        }, {
          "value": "inspiration ",
          "label": "设计-灵感采集"
        }, {
          "value": "interaction",
          "label": "设计-界面交互"
        }, {
          "value": "designSpecifications",
          "label": "设计-设计规范"
        }, {
          "value": "onlineTools",
          "label": "设计-在线工具"
        }, {
          "value": "icon",
          "label": "设计-icon图标"
        }, {
          "value": "designMaterial",
          "label": "设计-设计素材"
        }, {
          "value": "galleryMaterial",
          "label": "设计-图库素材"
        }, {
          "value": "colourAssortment",
          "label": "设计-颜色搭配"
        }, {
          "value": "fontGlyph",
          "label": "设计-字体字形"
        }, {
          "value": "learningTutorial",
          "label": "设计-学习教程"
        }, {
          "value": "designTeam",
          "label": "设计-设计团队"
        }, {
          "value": "recommendationProduct",
          "label": "产品-热门推荐"
        }, {
          "value": "productInformation ",
          "label": "产品-产品资讯"
        }, {
          "value": "prototypeTool",
          "label": "产品-原型工具"
        }, {
          "value": "mindMap",
          "label": "产品-思维导图"
        }, {
          "value": "teamwork",
          "label": "产品-协同工作"
        }, {
          "value": "documentEditing",
          "label": "产品-文档编辑"
        }, {
          "value": "diskStorage",
          "label": "产品-云盘储存"
        }, {
          "value": "interestingProducts",
          "label": "产品-趣味产品"
        }, {
          "value": "domainName",
          "label": "运营-域名注册"
        }, {
          "value": "dataAnalysis ",
          "label": "运营-数据分析"
        }, {
          "value": "dataTools",
          "label": "运营-数据工具"
        }, {
          "value": "dataCollection",
          "label": "运营-数据收集"
        }, {
          "value": "mediaPlatform",
          "label": "运营-新媒平台"
        }, {
          "value": "mediaTools",
          "label": "运营-新媒工具"
        }, {
          "value": "websiteInclusion",
          "label": "运营-网站收录"
        }, {
          "value": "ASOOptimization",
          "label": "运营-ASO优化"
        }, {
          "value": "recruitmentPlatform",
          "label": "工作-招聘平台"
        }, {
          "value": "partTimeProgram",
          "label": "工作-程序兼职"
        }, {
          "value": "partTimeDesign",
          "label": "工作-设计兼职"
        }, {
          "value": "developmentHardware",
          "label": "极客-开发硬件"
        }, {
          "value": "hardwareSystem",
          "label": "极客-硬件系统"
        }, {
          "value": "otherTools",
          "label": "极客-其他工具"
        }, {
          "value": "informationInquiry",
          "label": "极客-信息查询"
        }, {
          "value": "gameSystem",
          "label": "极客-游戏系统"
        }]
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
        action,
        category
      }) {
        const data = {
          // 页面信息
          ...crawler(),
          // 类型
          category,
          // api 需要
          source: 'd2',
          device: 'chrome'
        }

        this.form = data

        this.dialogVisible = true
      }
    }
  }
</script>
