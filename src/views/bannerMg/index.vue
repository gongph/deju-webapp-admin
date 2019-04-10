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
      <el-table-column align="center" label="轮播大图名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="轮播大图描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <template v-if="scope.row.contentUrl">
            <viewer :img-src="baseImgUrl + scope.row.contentUrl" :zoom="1"/>
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <!-- <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" disabled>编辑</el-button> -->
          <el-button
            type="danger"
            class="delete-btn"
            size="small"
            icon="el-icon-delete"
            @click="onDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import * as Api from '@/api/banner'
import Viewer from '@/components/Viewer'
import config from '@/utils/config.js'
import { removeRemoteImage } from '@/utils/file-uploader.js'
// import Pagination from '@/components/Pagination'
export default {
  name: 'BannerList',
  components: { Viewer },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      baseImgUrl: config.baseImgUrl
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
    },
    onDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.contentUrl) {
          this.removeImageFromMinio(row.contentUrl).then(() => {
            console.log(`Remove remote image successed!`)
          })
        }

        this.handleDelete(row.id).then(response => {
          if (response && response.status === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
        })
        .catch(err => {
          console.error(err)
        })
        
      }).catch(() => {
        // Do nothing      
      })
    },
    /**
     * 删除Minio 服务器上的图片
     */
    removeImageFromMinio(url) {
      const fileName = url ? url.split('/')[2] : ''
      return removeRemoteImage('banner', fileName)
    },
    handleDelete(id) {
      return Api.deleteById(id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
