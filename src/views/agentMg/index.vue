<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="代理商名称:">
        <el-input placeholder="代理商名称" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加代理商</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理商名称">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="激活状态">
        <template slot-scope="scope">
          <span v-if="scope.row.activated">激活</span>
          <span v-else>未激活</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.lastModifiedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastModifiedDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 新增代理商弹框 -->
    <el-dialog v-if="showMask" :visible.sync="showMask" :title="maskTitle" width="30%">
      <div class="dialog-form__wrapper">
        <el-form ref="ruleForm" :model="ruleForm" label-width="90px">
          <el-form-item label="代理商名称:">
            <el-input v-model="ruleForm.agentName"/>
          </el-form-item>

          <el-form-item label="登录账号:">
            <el-input v-model="ruleForm.loginAccount"/>
          </el-form-item>

          <el-form-item label="登录密码:">
            <el-input v-model="ruleForm.loginPassword"/>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/agent'
import Pagination from '@/components/Pagination'
export default {
  name: 'AgentList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      ruleForm: {
        agentName: '',
        loginAccount: '',
        loginPassword: ''
      },
      showMask: false,
      maskTitle: '新增'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: 0,
        pageSize: 10
      }).then(response => {
        console.log(response)
        this.list = response.data
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
    handleAdd() {
      this.showMask = true
    },
    submitForm(formName) {
      //
    },
    resetForm() {
      this.showMask = false
    }
  }
}
</script>

<style lang="scss" scoped>
  //
</style>
