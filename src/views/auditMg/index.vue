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
          <div class="image">
            <img :src="'data:image/png;base64,' + scope.row.idCardFrontPhoto" @click="handleViewer($event)">
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份证反面照">
        <template slot-scope="scope">
          <div class="image">
            <img :src="'data:image/png;base64,' + scope.row.idCardBackPhoto" @click="handleViewer($event)">
          </div>
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
          <template v-if="scope.row.orderStatus === '已通过' || scope.row.orderStatus === '已完成'">
            <el-button type="primary" size="small" icon="el-icon-view" @click="showMask = true">详情</el-button>
          </template>
          
          <el-dropdown>
            <el-button type="primary" size="small">
              {{ scope.row.orderStatus === '未审核' ? '初审' : '终审' }}<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>通过</el-dropdown-item>
              <el-dropdown-item>不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 查看详情弹框 -->
    <el-dialog
      :visible.sync="showMask"
      title="申请人信息"
    >
      <!-- 基本资料 -->
      <el-card class="box-card" shadow="none">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6">
              <strong>真实姓名: </strong>
              <span>张三</span>
            </el-col>
            <el-col :span="6">
              <strong>证件类型: </strong>
              <span>身份证</span>
            </el-col>
            <el-col :span="6">
              <strong>身份证号: </strong>
              <span>1212254525254525</span>
            </el-col>
            <el-col :span="6">
              <strong>实名手机号: </strong>
              <span>13012545854</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <p><strong>身份证正面照: </strong></p>
              <p>图片</p>
            </el-col>
            <el-col :span="6">
              <p><strong>身份证反面照: </strong></p>
              <p>图片</p>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 详细资料 -->
      <el-card class="detail-info" shadow="none" style="margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>详细资料</span>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6">
              <strong>性别: </strong>
              <span>女</span>
            </el-col>
            <el-col :span="6">
              <strong>年龄: </strong>
              <span>29</span>
            </el-col>
            <el-col :span="6">
              <strong>出生日期: </strong>
              <span>1993-05-05</span>
            </el-col>
            <el-col :span="6">
              <strong>邮箱: </strong>
              <span>zhangsan@163.com</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <strong>籍贯: </strong>
              <span>浙江</span>
            </el-col>
            <el-col :span="6">
              <strong>户口所在地: </strong>
              <span>呼家楼26号</span>
            </el-col>
            <el-col :span="6">
              <strong>所在城市: </strong>
              <span>北京</span>
            </el-col>
            <el-col :span="6">
              <strong>现居住地址: </strong>
              <span>长安街218号</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <strong>婚姻状况: </strong>
              <span>已婚</span>
            </el-col>
            <el-col :span="6">
              <strong>教育程度: </strong>
              <span>本科</span>
            </el-col>
            <el-col :span="6">
              <strong>是否工作: </strong>
              <span>是</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <strong>公司名称: </strong>
              <span>百度科技有限公司</span>
            </el-col>
            <el-col :span="6">
              <strong>公司所在城市: </strong>
              <span>北京</span>
            </el-col>
            <el-col :span="12">
              <strong>公司所在城市地址: </strong>
              <span>北京朝阳区望京218号</span>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <strong>公司电话: </strong>
              <span>010-400-8888</span>
            </el-col>
            <el-col :span="6">
              <strong>年收入: </strong>
              <span>10-20万</span>
            </el-col>
          </el-row>

        </div>
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
import { getAudits } from '@/api/product'
import Pagination from '@/components/Pagination'
import ViewerStyle from 'viewerjs/dist/viewer.min.css'
import Viewer from 'viewerjs'

export default {
  name: 'AuditList',
  components: { Pagination },
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
      viewer: null
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
    handleViewer(evt) {
      const viewer = new Viewer(evt.target, {
        title: false,
        navbar: false,
        toolbar: {
          zoomIn: 4,
          zoomOut: 4,
          oneToOne: 4,
          reset: 4,
          // prev: 4,
          play: {
            show: 4,
            size: 'large',
          },
          // next: 4,
          rotateLeft: 4,
          rotateRight: 4,
          flipHorizontal: 4,
          flipVertical: 4,
        },
        viewed() {
          viewer.zoomTo(1)
        }
      })
      viewer.show(true)
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
  .image {
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }
</style>
