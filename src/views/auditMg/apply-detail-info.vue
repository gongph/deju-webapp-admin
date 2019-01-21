<template>
  <div class="detail-info__wrapper">
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
  </div>
</template>

<script>
export default {
  name: 'ApplyDetailInfo',
  data() {
    return {
      //
    }
  },
  props: {
    data: {
      type: Object,
      default: () => { return null }
    }
  }
}
</script>
