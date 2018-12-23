<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="产品名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="产品名称"/>
        </el-form-item>

        <el-form-item label="描述:" prop="desc">
          <el-input v-model="ruleForm.desc" placeholder="简单介绍下这款产品..."/>
        </el-form-item>

        <el-form-item label="图标:" prop="icon">
          <el-upload
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="ruleForm.fileList"
            :limit="1"
            :multiple="false"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="额度范围:">
          <el-col :span="11">
            <el-form-item prop="minAmount">
              <el-input v-model="ruleForm.minAmount" placeholder="最小额度"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="11">
            <el-form-item prop="maxAmount">
              <el-input v-model="ruleForm.maxAmount" placeholder="最大额度"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="参考月息:" prop="interest">
          <el-input v-model="ruleForm.interest" placeholder="参考月息"/>
        </el-form-item>

        <el-form-item label="产品类型:" prop="loanType">
          <el-input v-model="ruleForm.loanType" placeholder="产品类型"/>
        </el-form-item>

        <el-form-item label="申请人数:" prop="applyNum">
          <el-input v-model="ruleForm.applyNum" placeholder="申请人数"/>
        </el-form-item>

        <el-form-item label="申请条件:" prop="applyConditions">
          <el-input
            v-model="ruleForm.applyConditions"
            :rows="4"
            type="textarea"
            resize="none"
            placeholder="申请条件"
          />
        </el-form-item>

        <el-form-item label="申请材料:" prop="applyData">
          <el-input
            v-model="ruleForm.applyData"
            :rows="4"
            type="textarea"
            resize="none"
            placeholder="申请材料"
          />
        </el-form-item>

        <el-form-item label="申请说明:" prop="applyExplain">
          <el-input
            v-model="ruleForm.applyExplain"
            :rows="4"
            type="textarea"
            resize="none"
            placeholder="例如：审核方式: 机审 + 人工；审核时间: 最快 30 分钟"
          />
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
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        desc: '',
        icon: '',
        minAmount: '',
        maxAmount: '',
        interest: '',
        loanType: '',
        fileList: []
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-wrapper {
    width: 50%;
  }
  .line {
    text-align: center;
  }
</style>
