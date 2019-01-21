<template>
  <div class="app-container banner-wrapper">
    <router-link to="/banner/add">
      <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus">添加展示大图</el-button>
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

      <el-table-column
        align="center"
        type="index"
        width="50"
      />
      <el-table-column align="center" label="轮播大图名称" width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="轮播大图描述" width="30%">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" width="50%">
        <template slot-scope="scope">
          <template v-if="scope.row.url">
            <img :src="'data:' + scope.row.urlContentType + ';base64,' + scope.row.url" :alt="scope.row.description" width="50px;">
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import * as Api from '@/api/banner'
// import Pagination from '@/components/Pagination'
export default {
  name: 'BannerList',
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
