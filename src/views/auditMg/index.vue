<template>
  <div class="app-container audit-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="代理商:" clearable>
        <el-input v-model="listQuery.user" placeholder="代理商名称" clearable/>
      </el-form-item>

      <el-form-item label="审核状态:" clearable>

        <el-select v-model="listQuery.status" placeholder="请选择" @change="handleSelectChange">
          <!-- <el-option label="全部" value=""/> -->
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

      <el-table-column align="center" label="代理商">
        <template slot-scope="scope">
          <span>{{ scope.row.user.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请人">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请额度(元)">
        <template slot-scope="scope">
          <template v-if="scope.row.amount">
            <span>{{ scope.row.amount }}</span>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请期限">
        <template slot-scope="scope">
          <template v-if="scope.row.deadline">
            <span>{{ scope.row.deadline }}个月</span>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.realNameMobilePhoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.personalInformation.identityNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证正面照">
        <template slot-scope="scope">
          <img :src="'http://th.minio.boyuanziben.cn' + scope.row.personalInformation.idCardFrontPhotoUrl + '_50x50'">
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证反面照">
        <template slot-scope="scope">
          <img :src="'http://th.minio.boyuanziben.cn' + scope.row.personalInformation.idCardBackPhotoUrl + '_50x50'">
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核状态" width="120">
        <template slot-scope="scope">
          <span>{{ formatAuditStatus(scope.row.auditStatus) }}</span>
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

      <el-table-column align="center" label="审核时间">
        <template slot-scope="scope">
          <template v-if="scope.row.lastModifiedDate">
            <span>{{ scope.row.lastModifiedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核人">
        <template slot-scope="scope">
          <template v-if="scope.row.lastModifiedBy">
            <span>{{ scope.row.lastModifiedBy }}</span>
          </template>
          <template v-else>
            <span>-</span>
          </template>
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

          <!-- 终审状态不显示审核按钮了 -->
          <template v-if="scope.row.auditStatus !== 'FINALTRIALPASSED' && scope.row.auditStatus !== 'FINALTRIALFAILURE'">
            <el-dropdown @command="handleCommand">
              <!-- <el-button type="primary" size="small">
                {{ !scope.row.personalInformation.city ? '初审' : '终审' }}
                <i class="el-icon-arrow-down el-icon--right"/>
              </el-button> -->
              <el-button type="primary" size="small">{{ auditBtnText }} <i class="el-icon-arrow-down el-icon--right"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="[true, scope.row]">通过</el-dropdown-item>
                <el-dropdown-item :command="[false, scope.row]">不通过</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

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

    <!-- 调整最终额度和期限弹框 -->
    <el-dialog
      v-if="showFinalAuditMask"
      :visible.sync="showFinalAuditMask"
      title="确认额度和期限"
      top="5vh"
      width="30%"
      @close="resetFinalForm('finalForm')"
    >
      <el-form ref="finalForm" :model="finalForm" :rules="finalFormRule" label-width="92px">
        <el-form-item label="产品名称:">
          <el-input :value="rowData.product.title" style="width: 199px;" disabled/>
        </el-form-item>
        <el-form-item label="额度范围:">
          <el-input :value="rowData.product.loanRangeStart + '-' + rowData.product.loanRangeEnd" style="width: 199px;" disabled>
            <svg-icon slot="suffix" icon-class="rmb"/>
          </el-input>
        </el-form-item>
        <el-form-item label="申请额度:">
          <el-input :value="rowData.amount" style="width: 199px;" disabled>
            <svg-icon slot="suffix" icon-class="rmb"/>
          </el-input>
        </el-form-item>
        <el-form-item label="申请期限:">
          <el-input :value="rowData.deadline + '个月'" style="width: 199px;" disabled/>
        </el-form-item>
        <el-form-item label="终审额度:">
          <el-input v-model="finalForm.amount" placeholder="请输入终审额度" style="width: 199px;">
            <svg-icon slot="suffix" icon-class="rmb"/>
          </el-input>
        </el-form-item>
        <el-form-item label="终审期限:" >
          <el-select v-model="finalForm.deadline" placeholder="请选择">
            <el-option
              v-for="(item, $index) of deadlines"
              :key="$index"
              :value="item"
              :label="item + '个月'"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFinalForm('finalForm')">取 消</el-button>
        <el-button type="primary" @click="handleFinalForm('finalForm')">{{ finalSubtnText }}</el-button>
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
        status: 'PENDINGREVIEW',
        user: ''
      },
      auditBtnText: '审核',
      finalSubtnText: '终审通过',
      showMask: false,
      showReasonMask: false,
      showFinalAuditMask: false,
      reasonForm: {
        auditReason: ''
      },
      reasonFormRule: {
        auditReason: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      finalForm: {
        amount: 0,
        deadline: 3
      },
      finalFormRule: {
        //
      },
      deadlines: [3, 6, 12, 24],
      // 基本信息
      baseInfo: null,
      // 详细信息
      moreInfo: null,
      // 当前行数据
      rowData: null
      // 审核阶段表示
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
      const data = {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }
      if (this.listQuery.status) {
        data.auditStatus = this.listQuery.status
      }
      if (this.listQuery.user) {
        data.user = this.listQuery.user
      }
      getAudits(data).then(response => {
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
      this.getList()
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
      const row = this.rowData = deepClone(command[1])
      const auditStatus = row.auditStatus
      const status = this.formatAuditStatus(auditStatus)

      // 通过操作
      if (flag) {
        if (status === '待审核') {
          this.rowData.auditStatus = CONST.FIRSTED
          this.rowData.auditReason = ''

          // 改变审核菜单按钮文本
          this.auditBtnText = '处理中...'
          this.handleAudit(() => {
            this.auditBtnText = '审核'
          })
        } else if (status === '初审通过' || status === '初审失败') {
          this.rowData.auditStatus = CONST.FINALED
          this.rowData.auditReason = ''

          // 赋值
          const { amount, deadline } = this.rowData
          this.finalForm.amount = amount
          this.finalForm.deadline = deadline

          // 显示终审弹框
          this.showFinalAuditMask = true
        }

        // 不通过操作
      } else {
        if (status === '待审核') {
          this.rowData.auditStatus = CONST.FIRSTFAIL
          this.rowData.auditReason = ''
        } else if (status === '初审通过' || status === '初审失败') {
          this.rowData.auditStatus = CONST.FINALFAIL
          this.rowData.auditReason = ''
        }
        this.showReasonMask = true
      }
    },
    handleAudit(cb) {
      let status = false
      updateAudits(this.rowData).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          status = true
          this.getList() // 刷新列表
        } else {
          status = false
          this.$message.error('提交失败')
        }

        // Callback
        if (cb && typeof cb === 'function') {
          cb(status)
        }
      }).catch(err => {
        this.$message.error('提交失败')
        console.error(err)
      })
    },
    handleFailAudit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.rowData.auditReason = this.reasonForm.auditReason
          this.handleAudit((flag) => {
            if (flag) this.showReasonMask = false
          })
        } else {
          return false
        }
      })
    },
    resetReasonForm(formName) {
      this.showReasonMask = false
      this.rowData = null
      // this.auditStep = 0
      this.$refs[formName].resetFields()
    },
    handleFinalForm(formName) {
      this.rowData.finalAmount = this.finalForm.amount
      this.rowData.finalDeadline = this.finalForm.deadline

      // 改变提交按钮文本
      this.finalSubtnText = '提交中...'
      this.handleAudit((flag) => {
        this.finalSubtnText = '终审通过'
        if (flag) this.showFinalAuditMask = false
      })
    },
    resetFinalForm(formName) {
      this.$refs[formName].resetFields()
      this.showFinalAuditMask = false
    },
    formatAuditStatus(val) {
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
