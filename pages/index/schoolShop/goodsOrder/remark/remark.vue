<template>
  <view class="content">
    <view>
      <textarea
        maxlength="30"
        placeholder="请输入，不超过30个字"
        v-model="remark"
      />
    </view>
    <view @click="submit">提交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      remark: "",
      goodsid: "",
      frompage: "",
      index: "",
      type: "",
    };
  },
  methods: {
    async submit() {
      let obj = {};
      if (this.frompage == "goodsorder") {
        obj.goodsid = this.goodsid;
        obj.value = this.remark;
      } else {
        if (this.type == 1) {
          obj.type = this.type;
          obj.index = this.index;
          obj.value = this.remark;
        } else {
          obj.type = this.type;
          obj.value = this.remark;
        }
      }
      // 文本检测
      try {
        let res = await this.$check.checkTxt(this.remark);
      } catch (error) {
        this.remark = "";
        return false;
      }
      uni.setStorage({
        key: "issueInfo",
        data: JSON.stringify(obj),
        success() {
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
  },
  onLoad: function (options) {
    this.frompage = options.frompage;
    this.remark = options.remark;
    if (options.frompage == "goodsorder") {
      this.goodsid = options.id;
    } else {
      if (options.type == 1) {
        this.type = options.type;
        this.index = options.index;
        this.remark = options.remark;
      } else {
        this.type = options.type;
        this.remark = options.remark;
      }
    }
  },
};
</script>

<style scoped>
.content {
  padding: 52rpx 24rpx;
  font-size: 28rpx;
}

textarea {
  background: #f9f9f9;
  width: 100%;
  padding: 24rpx;
  box-sizing: border-box;
  margin-bottom: 36rpx;
}

.content > view:nth-of-type(2) {
  line-height: 88rpx;
  text-align: center;
  background: #fec200;
  border-radius: 4px;
  margin-top: 90rpx;
}
</style>
