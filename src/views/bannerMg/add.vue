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
          <el-button type="primary" size="small" icon="el-icon-upload" @click="uploadIcon">上传图片</el-button>
          <input id="file" type="file" style="display: none;">
          <el-popover
            v-if="ruleForm.url"
            placement="right"
            trigger="click">
            <img :src="'data:' + ruleForm.urlContentType + ';base64,' + ruleForm.url" style="max-width: 50px;">
            <el-button slot="reference" type="text">预览</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { add } from '@/api/banner'
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
        url: '',
        urlContentType: ''
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
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add(this.ruleForm).then(response => {
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
