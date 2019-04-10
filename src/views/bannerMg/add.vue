<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="图片名称:" prop="title">
          <el-input v-model="ruleForm.title" placeholder="图片名称" class="width-50p"/>
        </el-form-item>

        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleForm.description" placeholder="简单介绍下这个图片..." class="width-50p"/>
        </el-form-item>

        <el-form-item label="图片:">
          <el-upload
            action="string"
            accept=".jpeg,.jpg,png"
            list-type="picture"
            :multiple="false"
            :show-file-list="showFileList"
            :limit="1"
            :http-request="uploadSectionFile"
            :on-remove="removeImage"
            :before-upload="beforeUpload"
          >
            <el-button
              size="small"
              type="primary"
              :disabled="ruleForm.contentUrl ? true : false"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')"></i>  点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png格式的文件哦~</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="uploading ? true : false">添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/api/banner'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'
export default {
  data() {
    return {
      loanTypes: [{
        label: '小微贷款',
        value: 'SMALLMICROLOAN'
      }],
      ruleForm: {
        title: '',
        description: '',
        contentUrl: '',
      },
      rules: {
        title: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        restrictionInformation: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        materialsInformation: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        applicationInformation: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      uploading: false,
      showFileList: true
    }
  },
  methods: {
    beforeUpload(file) {
      if (!file) return false

      const ext = /\.[^\.]+$/.exec(file.name)[0]

      if (!/\.(jpe?g|png)/.test(ext)) {
        this.showFileList = false
        this.$message({
          message: '只允许上传 jpg/jpeg/png 格式的图片哦~',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 新版上传方法
     */
    uploadSectionFile(data) {
      this.uploading = true
      uploader('banner', data.file).then(response => {
        this.uploading = false
        const { bucketName, fileName } = response
        this.ruleForm.contentUrl = `/${bucketName}/${fileName}`
      })
      .catch(err => {
        this.uploading = false
        console.error(err)
      })
    },
    /**
     * 删除图片
     */
    removeImage(file) {
      const url = this.ruleForm.contentUrl
      const fileName = url.split('/')[2]
      removeRemoteImage('banner', fileName).then(() => {
        console.log(`Remove image '${fileName}' successed!`)
        this.ruleForm.contentUrl = ''
        this.showFileList = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdate(this.ruleForm).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '添加展示图成功！',
                type: 'success'
              })
              // 重置表单
              this.resetForm(formName)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    uploadIcon() {
      const self = this
      const fileNode = document.getElementById('file')
      fileNode.click()
      fileNode.onchange = (evt) => {
        const reader = new FileReader()
        const file = evt.target.files[0]
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          const result = this.result
          self.ruleForm.url = result.substring(result.indexOf(',') + 1, result.length)
          self.ruleForm.urlContentType = file.type

          self.$message({
            message: '上传成功！',
            type: 'success'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-50p {
    width: 50%;
  }
  .form-wrapper {
    width: 50%;
  }
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
