<template>
  <view class="content">
    <view class="list">
      <text>联系人</text
      ><input v-model="forminfo.linkman" placeholder="请输入" />
    </view>
    <view class="list">
      <text>手机号</text
      ><input v-model="forminfo.phone" maxlength="11" placeholder="请输入" />
    </view>
    <view class="list" @click="openAddres">
      <text>选择地区</text
      ><input
        v-model="forminfo.address.pickerText"
        :disabled="true"
        placeholder="选择"
      />
      <u-icon name="arrow-right"></u-icon>
    </view>
    <view class="list">
      <text>详细地址</text
      ><input v-model="forminfo.detail" placeholder="请输入" />
    </view>
    <view class="list mo">
      <text>设为默认地址</text>
      <u-switch v-model="forminfo.is_default" active-color="#FEC200"></u-switch>
    </view>
    <view class="btn" @click="submit">保存</view>
    <simpleAddress
      ref="simpleAddress"
      :pickerValueDefault="pickerValueDefault"
      @onConfirm="onConfirm"
      themeColor="#007AFF"
    ></simpleAddress>
  </view>
</template>

<script>
import simpleAddress from "@/node_modules/simple-address/simple-address.vue";
import { createAddress, addressDetail } from "../../../../../services/mine.js";
export default {
  data() {
    return {
      pickerValueDefault: [0, 0, 0],
      id: "",
      forminfo: {
        phone: "",
        detail: "",
        linkman: "",
        is_default: false,
        address: {
          pickerText: "",
          areaCode: "130203",
          cityCode: "1302",
          provinceCode: "13",
        },
      },
    };
  },
  components: {
    simpleAddress,
  },
  methods: {
    async submit() {
      let regPhone = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (this.forminfo.linkman == "") {
        uni.showToast({
          title: "请输入联系人",
          icon: "none",
        });
        return false;
      } else if (!regPhone.test(this.forminfo.phone)) {
        uni.showToast({
          title: "请输入正确手机号",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.address.pickerText == "") {
        uni.showToast({
          title: "请选择地址",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.detail == "") {
        uni.showToast({
          title: "请输入详细地址",
          icon: "none",
        });
        return false;
      }
      // 文本检测
      try {
        let res = await this.$check.checkTxt(this.forminfo.linkman+this.forminfo.detail);
      } catch (error) {
        this.forminfo.detail = "";
        this.forminfo.linkman = "";
        return false;
      }
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
      let datas = {};
      if (this.id == "") {
        datas = {
          data: this.forminfo,
        };
      } else {
        datas = {
          id: this.id,
          data: this.forminfo,
        };
      }
      createAddress(datas).then((res) => {
        uni.hideLoading();
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
        }
      });
    },
    openAddres() {
      if (this.id != "") {
        // 赋值
        let index = this.$refs.simpleAddress.queryIndex(
          [
            this.forminfo.address.provinceCode,
            this.forminfo.address.cityCode,
            this.forminfo.address.areaCode,
          ],
          "value"
        );
        this.pickerValueDefault = index.index;
      }
      this.$refs.simpleAddress.open();
    },
    // 赋值
    openAddres3() {
      // 根据value 获取  provinceCode cityCode areaCode  山西省 太原市 小店区
      var index = this.$refs.simpleAddress.queryIndex(
        [14, 1401, 140105],
        "value"
      );
      // console.log(index);
      this.pickerValueDefault = index.index;
      this.$refs.simpleAddress.open();
    },
    onConfirm(e) {
      // console.log(e);
      this.forminfo.address.pickerText = e.label;
      this.forminfo.address.areaCode = e.areaCode;
      this.forminfo.address.cityCode = e.cityCode;
      this.forminfo.address.provinceCode = e.provinceCode;
    },
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      addressDetail({
        id: options.id,
      }).then((res) => {
        if (res.code == 200) {
          for (let i in this.forminfo) {
            this.forminfo[i] = res.result[i];
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.content {
  min-height: 100vh;
  background: #f2f2f2;
}

.list {
  padding: 32rpx 40rpx;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  background: #ffffff;
}

.list > text {
  width: 176rpx;
}

.list > input {
  flex: 1;
}

.content .mo {
  justify-content: space-between;
  margin-top: 24rpx;
}

.content .mo text {
  width: auto;
}

.btn {
  margin: 64rpx 40rpx 0;
  background: #fec200;
  border-radius: 25px;
  text-align: center;
  padding: 28rpx 0;
  font-weight: bold;
}
</style>
