<template>
  <div class="detail-info__wrapper">
    <!--  申请信息 -->
    <el-card class="box-card" shadow="none">
      <div slot="header" class="clearfix">
        <span>申请信息</span>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="6">
            <strong>产品名: </strong>
            <span>{{ data.product.title }}</span>
          </el-col>
          <el-col :span="6">
            <strong>申请额度: </strong>
            <span>{{ data.amount }}元</span>
          </el-col>
          <el-col :span="6">
            <strong>申请期限: </strong>
            <span>{{ data.deadline }}个月</span>
          </el-col>
        </el-row>
        <template v-if="data.finalAmount">
          <el-row :gutter="20">
            <el-col :span="6">
              <strong>终审额度: </strong>
              <span style="color:#F56C6C">{{ data.finalAmount }}</span>元
            </el-col>
            <el-col :span="6">
              <strong>终审期限: </strong>
              <span style="color:#F56C6C">{{ data.finalDeadline }}</span>个月
            </el-col>
          </el-row>
        </template>
      </div>
    </el-card>
    <!-- 基本资料 -->
    <el-card class="box-card" shadow="none" style="margin-top: 20px">
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
            <viewer
              :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.idCardFrontPhotoUrl"/>
          </el-col>
          <el-col :span="6">
            <p><strong>身份证反面照: </strong></p>
            <viewer
              :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.idCardBackPhotoUrl"
              style="width: 50px;"/>
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
        <h4>个人信息：</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <strong>所在城市: </strong>
            <span>{{ data.personalInformation.city }}</span>
          </el-col>
          <el-col :span="6">
            <strong>住宅地址: </strong>
            <span>{{ data.personalInformation.residentialAddress }}</span>
          </el-col>
          <el-col :span="6">
            <strong>邮箱: </strong>
            <span>{{ data.personalInformation.personalEmail }}</span>
          </el-col>
          <el-col :span="6">
            <strong>婚姻状况: </strong>
            <span>{{ data.personalInformation.maritalStatus }}</span>
          </el-col>
          <el-col :span="6">
            <strong>教育程度: </strong>
            <span>{{ data.personalInformation.educationLevel }}</span>
          </el-col>
        </el-row>

        <h4>工作信息：</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <strong>单位名称: </strong>
            <span>{{ data.personalInformation.companyName }}</span>
          </el-col>
          <el-col :span="6">
            <strong>单位城市: </strong>
            <span>{{ data.personalInformation.companyCity }}</span>
          </el-col>
          <el-col :span="6">
            <strong>单位电话: </strong>
            <span>{{ data.personalInformation.companyPhone }}</span>
          </el-col>
          <el-col :span="6">
            <strong>年收入: </strong>
            <span>{{ data.personalInformation.annualIncome }}</span>
          </el-col>
        </el-row>

        <h4>联系人信息：</h4>
        <el-row :gutter="20">
          <el-col :span="10">
            <strong>联系人1姓名: </strong>
            <span>{{ data.personalInformation.contactName }}</span>
          </el-col>
          <el-col :span="10">
            <strong>联系人1电话: </strong>
            <span>{{ data.personalInformation.contactPhone }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <strong>联系人2姓名: </strong>
            <span>{{ data.personalInformation.contactName2 }}</span>
          </el-col>
          <el-col :span="10">
            <strong>联系人2电话: </strong>
            <span>{{ data.personalInformation.contactPhone2 }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <strong>紧急联系人姓名（父/母）: </strong>
            <span>{{ data.personalInformation.contactName3 }}</span>
          </el-col>
          <el-col :span="10">
            <strong>紧急联系人电话（父/母） </strong>
            <span>{{ data.personalInformation.contactPhone3 }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <strong>紧急联系人姓名（配偶）: </strong>
            <span>{{ data.personalInformation.contactName4 }}</span>
          </el-col>
          <el-col :span="10">
            <strong>紧急联系人电话（配偶）: </strong>
            <span>{{ data.personalInformation.contactPhone4 }}</span>
          </el-col>
        </el-row>

        <h4>证明材料：</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <p><strong>工作证明照片: </strong></p>
            <template v-if="data.personalInformation.workNamePhotoUrl">
              <viewer
                :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.workNamePhotoUrl "/>
            </template>
            <template v-else>
              <span>(无)</span>
            </template>

          </el-col>
          <el-col :span="6">
            <p><strong>营业执照: </strong></p>
            <template v-if="data.personalInformation.businessLicensePhotoUrl">
              <viewer
                :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.businessLicensePhotoUrl"/>
            </template>
            <template v-else>
              <span>(无)</span>
            </template>

          </el-col>
          <el-col :span="6">
            <p><strong>房产证明或房本: </strong></p>
            <template v-if="data.personalInformation.proofOfRealEstateUrl">
              <viewer
                :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.proofOfRealEstateUrl"/>
            </template>
            <template v-else>
              <span>(无)</span>
            </template>
          </el-col>
          <el-col :span="6">
            <p><strong>购房网签合同: </strong></p>
            <template v-if="data.personalInformation.purchaseAHouseNetworkContractUrl">
              <viewer
                :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.purchaseAHouseNetworkContractUrl"/>
            </template>
            <template v-else>
              <span>(无)</span>
            </template>
          </el-col>
          <el-col :span="6">
            <p><strong>其他材料: </strong></p>
            <template v-if="data.personalInformation.otherPhotoUrl">
              <viewer
                :img-src="'http://th.minio.boyuanziben.cn' + data.personalInformation.otherPhotoUrl"/>
            </template>
            <template v-else>
              <span>(无)</span>
            </template>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import Viewer from '@/components/Viewer'
export default {
  name: 'ApplyDetailInfo',
  components: { Viewer },
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

<style lang="scss" scoped>
  .detail-info__wrapper {
    height: 600px;
    overflow-y: auto;
  }
  .el-row {
    line-height: 2;
    .el-col {
      strong {
        font-weight: normal;
      }
      span {
        color: gray;
      }
    }
  }
</style>
