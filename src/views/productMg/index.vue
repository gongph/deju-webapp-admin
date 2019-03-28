<template>
  <div class="app-container product-wrapper">
    <router-link to="/product/add">
      <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus">添加产品</el-button>
    </router-link>
    <el-button type="text" icon="el-icon-refresh" @click="getList">刷新</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="申请条件：">
              <span>{{ props.row.restrictionInformation }}</span>
            </el-form-item>
            <el-form-item label="申请材料：">
              <span>{{ props.row.materialsInformation }}</span>
            </el-form-item>
            <el-form-item label="申请说明：">
              <span>{{ props.row.applicationInformation }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="产品名称" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="借款类型" width="100">
        <template slot-scope="scope">
          <span>{{ formatType(scope.row.loanType) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图标" width="80">
        <template slot-scope="scope">
          <template v-if="scope.row.icon">
            <img :src="'data:image/png;base64,' + scope.row.icon" :alt="scope.row.title" width="50px;">
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="额度范围(元)" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.loanRangeStart }} - {{ scope.row.loanRangeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="利率范围(%)" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.interestRateRangeStart }} - {{ scope.row.interestRateRangeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="期限范围" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.loanRangeStart }} - {{ scope.row.loanRangeEnd }}月</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="参考月息" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.referenceMonthInterest }}%</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请人数" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.numberOfApplicants }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <!-- 编辑产品弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      title="编辑产品"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" button-text="编辑"/>
    </el-dialog>

  </div>
</template>

<script>
import * as Api from '@/api/product'
import { types } from '@/utils/loan.js'
// import Pagination from '@/components/Pagination'
import AddPage from './add.vue'
export default {
  name: 'ProductList',
  components: { AddPage },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      showMask: false,
      curProd: null
    }
  },
  created() {
    this.getList()

    // 监听一个保存成功的回调
    // 用于修改产品后触发列表刷新
    this.$on('saveNotify', (flag) => {
      this.showMask = false
      if (flag) this.getList()
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList().then(response => {
        this.list = response.data
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
    handleEdit(row) {
      this.showMask = true
      this.curProd = row
    },
    handleClose() {
      this.curProd = null
    },
    formatType(val) {
      return types.get(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
