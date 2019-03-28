<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="产品名称:" prop="title">
          <el-input v-model="ruleForm.title" placeholder="产品名称" class="width-50p"/>
        </el-form-item>

        <el-form-item label="描述:" prop="description">
          <el-input v-model="ruleForm.description" placeholder="简单介绍下这款产品..." class="width-50p"/>
        </el-form-item>

        <el-form-item label="图标:">
          <el-button type="primary" size="small" icon="el-icon-upload" @click="uploadIcon">上传图标</el-button>
          <input id="file" type="file" style="display: none;">
          <el-popover
            v-if="ruleForm.icon"
            placement="right"
            trigger="click">
            <img :src="'data:image/png;base64,' + ruleForm.icon" style="max-width: 50px;">
            <el-button slot="reference" type="text">预览</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item label="额度范围:">
          <el-col :span="6">
            <el-form-item prop="loanRangeStart">
              <el-input v-model="ruleForm.loanRangeStart" placeholder="最小额度">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">—</el-col>
          <el-col :span="6">
            <el-form-item prop="loanRangeEnd">
              <el-input v-model="ruleForm.loanRangeEnd" placeholder="最大额度">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="利率范围:">
          <el-col :span="6">
            <el-form-item prop="interestRateRangeStart">
              <el-input v-model="ruleForm.interestRateRangeStart" placeholder="最小利率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">—</el-col>
          <el-col :span="6">
            <el-form-item prop="interestRateRangeEnd">
              <el-input v-model="ruleForm.interestRateRangeEnd" placeholder="最大利率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="期限范围:">
          <el-col :span="6">
            <el-form-item prop="termRangeStart">
              <el-input v-model="ruleForm.termRangeStart" placeholder="最小期限">
                <template slot="append">月</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">—</el-col>
          <el-col :span="6">
            <el-form-item prop="termRangeEnd">
              <el-input v-model="ruleForm.termRangeEnd" placeholder="最大期限">
                <template slot="append">月</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="参考月息:" prop="referenceMonthInterest">
          <el-input v-model="ruleForm.referenceMonthInterest" placeholder="参考月息" class="width-50p">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="产品类型:" prop="loanType">
          <el-select v-model="ruleForm.loanType" class="width-50p" placeholder="请选择">
            <el-option
              v-for="item in loanTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="申请人数:" prop="applyNum">
          <el-input v-model="ruleForm.numberOfApplicants" placeholder="申请人数" class="width-50p">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>

        <el-form-item label="申请条件:" prop="restrictionInformation">
          <el-input
            v-model="ruleForm.restrictionInformation"
            :rows="4"
            type="textarea"
            class="width-50p"
            resize="none"
            placeholder="申请条件"
          />
        </el-form-item>

        <el-form-item label="申请材料:" prop="materialsInformation">
          <el-input
            v-model="ruleForm.materialsInformation"
            :rows="4"
            type="textarea"
            resize="none"
            class="width-50p"
            placeholder="申请材料"
          />
        </el-form-item>

        <el-form-item label="申请说明:" prop="applicationInformation">
          <el-input
            v-model="ruleForm.applicationInformation"
            :rows="4"
            type="textarea"
            class="width-50p"
            resize="none"
            placeholder="例如：审核方式: 机审 + 人工；审核时间: 最快 30 分钟"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即{{ buttonText }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/api/product'
import { deepClone } from '@/utils'

export default {
  name: 'AddOrEditProductPage',
  props: {
    formData: {
      type: Object,
      default: null
    },
    buttonText: {
      type: String,
      default: '添加'
    }
  },
  data() {
    return {
      loanTypes: [{
        label: '小微贷款',
        value: 'SMALLMICROLOAN'
      }],
      ruleForm: {
        id: 0,
        title: '',
        description: '',
        icon: '',
        iconContentType: '',
        // 额度范围
        loanRangeStart: 0,
        loanRangeEnd: 0,
        // 利率范围
        interestRateRangeStart: 0,
        interestRateRangeEnd: 0,
        // 期限范围
        termRangeStart: 3,
        termRangeEnd: 24,
        // 利率
        // interest: 0,
        // 参考月息
        referenceMonthInterest: 0,
        // 产品类型
        loanType: 'SMALLMICROLOAN',
        // 申请说明
        applicationInformation: '',
        // 申请材料
        materialsInformation: '',
        // 申请限制
        restrictionInformation: '',
        // 申请人数
        numberOfApplicants: 0
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
  created() {
    if (this.formData) this.ruleForm = deepClone(this.formData)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          // 检查当前是新增还是保存
          let method = 'post'
          if (this.ruleForm.id || this.buttonText === '编辑') {
            method = 'put'
          }

          // 新增或保存操作
          saveOrUpdate(this.ruleForm, method).then(response => {
            if (response.status === 201 || response.status === 200) {
              this.$message({
                message: `${this.buttonText}产品成功！`,
                type: 'success'
              })

              // 产品列表组件
              let productIndexComp = this.$parent.$parent
              if (this.buttonText === '编辑' || productIndexComp.$options.name === 'ProductList') {
                // 通知父组件中的监听回调方法
                productIndexComp.$emit('saveNotify', true)
              } else {
                // 新增完重置表单
                this.resetForm(formName)
              }
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
          self.ruleForm.icon = result.substring(result.indexOf(',') + 1, result.length)
          self.ruleForm.iconContentType = file.type

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
  // .width-50p {
  //   width: 50%;
  // }
  // .form-wrapper {
  //   width: 50%;
  // }
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
