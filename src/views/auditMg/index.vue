<template>
  <div class="app-container audit-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="审核状态:" clearable>
        <el-select v-model="listQuery.status" placeholder="请选择" @change="handleSelectChange">
          <el-option label="全部" value=""/>
          <el-option
            v-for="(item, $index) of status"
            :key="$index"
            :value="item[0]"
            :label="item[1]"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="handleSelectChange">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="申请人真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.realNameMobilePhoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.identityNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证正面照">
        <template slot-scope="scope">
          <viewer :img-src="'data:' + scope.row.personalInformation.idCardFrontPhotoContentType + ';base64,' + scope.row.personalInformation.idCardFrontPhoto"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证反面照">
        <template slot-scope="scope">
          <viewer :img-src="'data:' + scope.row.personalInformation.idCardBackPhotoContentType + ';base64,' + scope.row.personalInformation.idCardBackPhoto"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理商姓名" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.user.firstName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核状态" width="120">
        <template slot-scope="scope">
          <span>{{ formatType(scope.row.auditStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核原因">
        <template slot-scope="scope">
          <span v-if="scope.row.auditReason">{{ scope.row.auditReason }}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="录入时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-view"
            @click="showDetail(scope.row)">
            查看
          </el-button>

          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="small">
              {{ !scope.row.personalInformation.city ? '初审' : '终审' }}
              <i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="[true, scope.row]">通过</el-dropdown-item>
              <el-dropdown-item :command="[false, scope.row]">不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 查看详情弹框 -->
    <el-dialog :visible.sync="showMask" title="申请人信息" top="5vh">
      <apply-detail-info :data="baseInfo"/>
    </el-dialog>

    <!-- 审核失败原因弹框 -->
    <el-dialog
      v-if="showReasonMask"
      :visible.sync="showReasonMask"
      title="审核不通过原因"
      top="5vh"
      width="30%"
      @close="resetReasonForm('reasonForm')"
    >
      <el-form ref="reasonForm" :model="reasonForm" :rules="reasonFormRule">
        <el-form-item label="" prop="auditReason">
          <el-input v-model="reasonForm.auditReason" :rows="4" type="textarea" placeholder="请输入审核不通过原因..."/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetReasonForm('reasonForm')">取 消</el-button>
        <el-button type="primary" @click="handleFailAudit('reasonForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAudits, updateAudits } from '@/api/product'
import Pagination from '@/components/Pagination'
import Viewer from '@/components/Viewer'
import ApplyDetailInfo from './apply-detail-info.vue'
import { auditStatus } from '@/utils/auditStatus.js'
import { deepClone } from '@/utils'

const CONST = {
  PENDING: 'PENDINGREVIEW', // 待审核
  FIRSTED: 'FIRSTTRIALPASSED', // 初审通过
  FIRSTFAIL: 'FIRSTTRIALFAILED', // 初审失败
  FINALED: 'FINALTRIALPASSED', // 终审通过
  FINALFAIL: 'FINALTRIALFAILURE' // 终审失败
}

export default {
  name: 'AuditList',
  components: { Viewer, ApplyDetailInfo, Pagination },
  directives: {
    shouldHide: {
      inserted: function(el, binding) {
        const sta = binding.value
        if (!sta === CONST.PENDING || !sta === CONST.FIRSTED) {
          el.style.display = 'none'
          el.style.height = '0px'
          el.style.width = '0px'
        }
      }
    }
  },
  data() {
    return {
      list: [],
      copyList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        status: ''
      },
      showMask: false,
      showReasonMask: false,
      reasonForm: {
        auditReason: ''
      },
      reasonFormRule: {
        auditReason: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      // 基本信息
      baseInfo: null,
      // 详细信息
      moreInfo: null,
      // 当前行数据
      rowData: null,
      // 审核阶段表示
      auditStep: 0 // 0 待审核; 1 初审; 2 终审
    }
  },
  computed: {
    status() {
      return Array.from(auditStatus) || []
    },
    disabled() {
      return (this.list.length <= 0)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAudits({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        if (response.status !== 200) return
        this.list = response.data
        this.copyList = response.data // 用于数据筛选
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectChange(val) {
      val = (typeof val !== 'string') ? this.listQuery.status : val
      this.filterList(val)
    },
    filterList(val) {
      if (this.copyList.length <= 0) return
      const copyList = this.copyList

      if (!val) {
        this.list = deepClone(copyList)
      } else {
        const arr = copyList.filter(item => {
          return item.auditStatus === val
        })
        this.list = arr
      }
    },
    showDetail(row) {
      this.baseInfo = row
      this.showMask = true
    },
    /**
     * 处理下拉菜单
     */
    handleCommand(command) {
      const flag = command[0]
      this.rowData = deepClone(command[1])
      // 随便找一个字段判断是初审还是终审环节
      // city 只有详细信息里才会输入
      const city = this.rowData.personalInformation.city
      if (!city) {
        // 初审
        if (flag) {
          // 通过
          this.rowData.auditStatus = CONST.FIRSTED
          this.rowData.auditReason = ''
          this.handleAudit()
        } else {
          // 不通过
          this.showReasonMask = true
          this.auditStep = 1
        }
      } else {
        // 终审
        if (flag) {
          // 通过
          this.rowData.auditStatus = CONST.FINALED
          this.rowData.auditReason = ''
          this.handleAudit()
        } else {
          // 不通过
          this.showReasonMask = true
          this.auditStep = 2
        }
      }
    },
    handleAudit() {
      updateAudits(this.rowData).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.getList() // 刷新列表
        } else {
          this.$message.error('提交失败')
        }
      }).catch(err => {
        this.$message.error('提交失败')
        console.error(err)
      })
    },
    handleFailAudit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.auditStep === 1) {
            this.rowData.auditStatus = CONST.FIRSTFAIL
          } else if (this.auditStep === 2) {
            this.rowData.auditStatus = CONST.FINALFAIL
          }
          this.rowData.auditReason = this.reasonForm.auditReason
          this.handleAudit()
          setTimeout(() => {
            this.showReasonMask = false
          }, 100)
        } else {
          return false
        }
      })
    },
    resetReasonForm(formName) {
      this.showReasonMask = false
      this.rowData = null
      this.auditStep = 0
      this.$refs[formName].resetFields()
    },
    formatType(val) {
      return auditStatus.get(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-info {
    .el-row + .el-row {
      margin-top: 20px;
    }
  }
</style>
