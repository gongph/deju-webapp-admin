<template>
  <div class="app-container audit-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="审核状态:" clearable>
        <el-select v-model="listQuery.status" placeholder="请选择">
          <el-option label="全部" value=""/>
          <el-option :value="0" label="待审核"/>
          <el-option :value="1" label="未通过"/>
          <el-option :value="2" label="已通过"/>
          <el-option :value="3" label="已完成"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="success" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名:">
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

      <el-table-column align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{ formatType(scope.row.auditStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="录入时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" max-width="240">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-view"
            @click="showDetail(scope.$index, list)">
            查看
          </el-button>

          <el-dropdown @command="handleCommand" v-should-hide="scope.row.auditStatus">
            <el-button type="primary" size="small">
              {{ formatType(scope.row.auditStatus) === '待审核' ? '初审' : '终审' }}
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

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <!-- 查看详情弹框 -->
    <el-dialog :visible.sync="showMask" title="申请人信息" top="5vh">
      <apply-detail-info :data="baseInfo"/>
    </el-dialog>

  </div>
</template>

<script>
import { getAudits, updateAudits } from '@/api/product'
// import Pagination from '@/components/Pagination'
import Viewer from '@/components/Viewer'
import ApplyDetailInfo from './apply-detail-info.vue'
import { auditStatus } from '@/utils/auditStatus.js'
import { deepClone } from '@/utils'

const CONST = {
  PENDING: 'PENDINGREVIEW',    // 待审核
  FIRSTED: 'FIRSTTRIALPASSED', // 初审通过
  FINALED: 'FINALTRIALPASSED', // 终审通过
}

export default {
  name: 'AuditList',
  components: { Viewer, ApplyDetailInfo },
  directives: {
    shouldHide: {
      inserted: function (el, binding) {
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 0
      },
      showMask: false,
      // 基本信息
      baseInfo: null,
      // 详细信息
      moreInfo: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAudits().then(response => {
        this.list = response.data
        // this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleChange(val) {
      console.log(val)
    },
    showDetail(index, list) {
      this.baseInfo = list[index]
      this.showMask = true
    },
    /**
     * 处理下拉菜单
     */
    handleCommand(command) {
      const auditFlag = command[0]
      const row = deepClone(command[1])

      if (row.auditStatus === CONST.PENDING) {
        row.auditStatus = CONST.FIRSTED
      } 
      else if (row.auditStatus === CONST.FIRSTED) {
        row.auditStatus = CONST.FINALED
      }

      // 更新
      updateAudits(row).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          this.getList() // 刷新列表
        } else {
          this.$message.error('审核失败')
        }
      }).catch(err => {
        this.$message.error('审核失败')
        console.error(err)
      })
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
