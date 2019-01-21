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
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.realNameMobilePhoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.identityNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证正面照">
        <template slot-scope="scope">
          <viewer :img-src="'data:image/png;base64,' + scope.row.idCardFrontPhoto"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证反面照">
        <template slot-scope="scope">
          <viewer :img-src="'data:image/png;base64,' + scope.row.idCardBackPhoto"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核状态">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="录入时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" max-width="240">
        <template slot-scope="scope">
          <!-- <template v-if="scope.row.orderStatus === '已通过' || scope.row.orderStatus === '已完成'"> -->
            <el-button
              type="primary"
              size="small"
              icon="el-icon-view"
              @click="showDetail">
              详情
            </el-button>
          <!-- </template> -->
          
          <el-dropdown>
            <el-button type="primary" size="small">
              {{ scope.row.orderStatus === '未审核' ? '初审' : '终审' }}
              <i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>通过</el-dropdown-item>
              <el-dropdown-item>不通过</el-dropdown-item>
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
    <el-dialog :visible.sync="showMask" title="申请人信息">
      <apply-detail-info :data=""/>
    </el-dialog>

  </div>
</template>

<script>
import { getAudits } from '@/api/product'
// import Pagination from '@/components/Pagination'
import Viewer from '@/components/Viewer'
import ApplyDetailInfo from './apply-detail-info.vue'

export default {
  name: 'AuditList',
  components: { Viewer, ApplyDetailInfo },
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
        //this.total = response.data.total
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
    showDetail(row) {
      this.baseInfo = row
      this.showMask = true
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
