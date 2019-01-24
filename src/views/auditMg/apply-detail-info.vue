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
            <span>{{ data.personalInformation.name }}</span>
          </el-col>
          <el-col :span="6">
            <strong>证件类型: </strong>
            <span>身份证</span>
          </el-col>
          <el-col :span="6">
            <strong>身份证号: </strong>
            <span>{{ data.personalInformation.identityNumber }}</span>
          </el-col>
          <el-col :span="6">
            <strong>实名手机号: </strong>
            <span>{{ data.personalInformation.realNameMobilePhoneNumber }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <p><strong>身份证正面照: </strong></p>
            <p><img :src="'data:' + data.personalInformation.idCardFrontPhotoContentType + ';base64,' + data.personalInformation.idCardFrontPhoto"></p>
          </el-col>
          <el-col :span="6">
            <p><strong>身份证反面照: </strong></p>
            <p><img :src="'data:' + data.personalInformation.idCardBackPhotoContentType + ';base64,' + data.personalInformation.idCardBackPhoto"></p>
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
            <span>{{ data.personalInformation.identityNumber }}</span>
          </el-col>
          <el-col :span="6">
            <strong>年龄: </strong>
            <span>{{ data.personalInformation.identityNumber }}</span>
          </el-col>
          <el-col :span="6">
            <strong>出生日期: </strong>
            <span>{{ data.personalInformation.identityNumber }}</span>
          </el-col>
          <el-col :span="6">
            <strong>邮箱: </strong>
            <span>{{ data.personalInformation.personalEmail }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <strong>籍贯: </strong>
            <span>{{ data.personalInformation.identityNumber }}</span>
          </el-col>
          <el-col :span="6">
            <strong>户口所在地: </strong>
            <span>{{ data.personalInformation.residentialAddress }}</span>
          </el-col>
          <el-col :span="6">
            <strong>所在城市: </strong>
            <span>{{ data.personalInformation.city }}</span>
          </el-col>
          <el-col :span="6">
            <strong>现居住地址: </strong>
            <span>{{ data.personalInformation.residentialAddress }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <strong>婚姻状况: </strong>
            <span>{{ data.personalInformation.maritalStatus }}</span>
          </el-col>
          <el-col :span="6">
            <strong>教育程度: </strong>
            <span>{{ data.personalInformation.educationLevel }}</span>
          </el-col>
          <el-col :span="6">
            <strong>是否工作: </strong>
            <span>{{ data.personalInformation.companyName }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <strong>公司名称: </strong>
            <span>{{ data.personalInformation.companyName }}</span>
          </el-col>
          <el-col :span="6">
            <strong>公司所在城市: </strong>
            <span>{{ data.personalInformation.companyCity }}</span>
          </el-col>
          <el-col :span="12">
            <strong>公司所在城市地址: </strong>
            <span>{{ data.personalInformation.companyAdress }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <strong>公司电话: </strong>
            <span>{{ data.personalInformation.companyPhone }}</span>
          </el-col>
          <el-col :span="6">
            <strong>年收入: </strong>
            <span>{{ data.personalInformation.annualIncome }}万</span>
          </el-col>
        </el-row>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ApplyDetailInfo',
  props: {
    data: {
      type: Object,
      default: () => { return null }
    }
  },
  data() {
    return {
      //
    }
  }
}
</script>
