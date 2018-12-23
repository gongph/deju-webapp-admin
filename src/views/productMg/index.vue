<template>
  <div class="app-container product-wrapper">
    <router-link to="/product/add">
      <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus">添加产品</el-button>
    </router-link>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="额度范围(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.productInfo.loanRangeStart }} - {{ scope.row.productInfo.loanRangeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="利率范围(%)">
        <template slot-scope="scope">
          <span>{{ scope.row.productInfo.interestRateRangeStart }} - {{ scope.row.productInfo.interestRateRangeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="贷款期限">
        <template slot-scope="scope">
          <span>{{ scope.row.productInfo.deadline }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请人数">
        <template slot-scope="scope">
          <span>{{ scope.row.productInfo.numberOfApplicants }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import * as Api from '@/api/product'
// import Pagination from '@/components/Pagination'
export default {
  name: 'ProductList',
  // components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList().then(response => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
