<template>
  <view class="content">
    <view class="top1" v-if="type == 0 || type == 3">
      <view class="top1_1">
        <image
          :src="
            forminfo.header == ''
              ? '/static/mine/shop1.png'
              : imgBaseUrl + forminfo.header
          "
          @click="uphead"
        ></image>
        <view>点击添加店铺头像</view>
      </view>
      <view class="top1_2">
        <view>店铺名称</view>
        <view
          ><input
            placeholder="请输入不超过8个字"
            maxlength="8"
            v-model="forminfo.name"
        /></view>
      </view>
      <view class="top1_2">
        <view>店铺详细地址</view>
        <view><input placeholder="请输入" v-model="forminfo.address" /></view>
      </view>
      <view class="top1_2">
        <view>联系人</view>
        <view><input placeholder="请输入" v-model="forminfo.linkman" /></view>
      </view>
      <view class="top1_2">
        <view>联系电话</view>
        <view
          ><input
            placeholder="请输入"
            type="number"
            maxlength="11"
            v-model="forminfo.phone"
        /></view>
      </view>
      <view class="top1_2" v-if="type == 3">
        <view style="margin-bottom: 20rpx">店铺背景</view>
        <view>
          <u-upload
            :action="action"
					:size-type="['compressed']"
            max-count="1"
            width="375rpx"
            height="192rpx"
            :file-list="fileList1"
            :show-tips="false"
            @on-remove="onRemove1"
            @on-success="onSuccess1"
            ref="uUpload"
            :auto-upload="true"
					:before-upload="beforeUpload1"
          ></u-upload>
        </view>
      </view>
      <view class="top1_2">
        <view style="margin-bottom: 20rpx">实体图</view>
        <view>
          <u-upload
            :action="action"
					:size-type="['compressed']"
            max-count="5"
            :file-list="fileList"
            @on-remove="onRemove"
            :show-tips="false"
            @on-success="onSuccess"
            ref="uUpload"
            :auto-upload="true"
					:before-upload="beforeUpload"
          ></u-upload>
        </view>
      </view>
      <view class="top1_3">
        <view>
          <u-checkbox v-model="checked" shape="circle" active-color="#FEC200"
            >同意</u-checkbox
          ><text @click="showxy = !showxy">《店铺加盟协议》</text>
        </view>
        <view @click="openShop" class="btn">提交</view>
      </view>
    </view>
    <view class="top2" v-else>
      <image
        :src="
          type == 2 ? '/static/mine/shoping.png' : '/static/mine/shopover.png'
        "
      ></image>
      <view>{{ type == 2 ? "审核中" : "已开店" }}</view>
      <view>
        {{
          type == 2
            ? "客服将在24小时内联系你"
            : "您已成功开通店铺，赶紧去经营它吧"
        }}</view
      >
    </view>
    <u-popup v-model="showxy" mode="center" border-radius="8">
      <view class="popxy"> 我是协议 </view>
    </u-popup>
    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import { CreateStore, storeDetail } from "../../../../services/shop.js";
import { delImages } from "../../../../services/community.js";
import helangCompress from "@/components/helang-compress/helang-compress";
export default {
  components: {
    helangCompress,
  },
  data() {
    return {
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
      id: "",
      forminfo: {
        user_id: 1,
        header: "",
        name: "",
        address: "",
        linkman: "",
        phone: "",
        image: [],
        backimage: "",
      },
      fileList: [],
      fileList1: [],
      checked: true,
      type: "", // 0：不是店家，1：是店家，2：申请中 3 修改店铺信息
      imgBaseUrl: getApp().globalData.imgBaseUrl,
      showxy: false,
    };
  },
  methods: {
    async openShop() {
      let regPhone = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (JSON.parse(uni.getStorageSync("user")).is_real.code != 1) {
        uni.showToast({
          title: "实名后才能申请店铺",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.header == "") {
        uni.showToast({
          title: "请上传店铺头像",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.name == "") {
        uni.showToast({
          title: "请输入店铺名称",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.address == "") {
        uni.showToast({
          title: "请输入店铺详细地址",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.linkman == "") {
        uni.showToast({
          title: "请输入店铺联系人",
          icon: "none",
        });
        return false;
      } else if (!regPhone.test(this.forminfo.phone)) {
        uni.showToast({
          title: "请输入正确手机号",
          icon: "none",
        });
        return false;
      } else if (this.forminfo.image.length < 1) {
        uni.showToast({
          title: "请上传实体图",
          icon: "none",
        });
        return false;
      } else if (!this.checked) {
        uni.showToast({
          title: "请勾选店铺加盟协议",
          icon: "none",
        });
        return false;
      }
      // 文本检测
      try {
        let res = await this.$check.checkTxt(
          this.forminfo.name + this.forminfo.linkman + this.forminfo.address
        );
      } catch (error) {
        this.forminfo.address = "";
        this.forminfo.name = "";
        this.forminfo.linkman = "";
        return false;
      }
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
      let datas = {};
      if (this.type == 0) {
        datas = {
          data: this.forminfo,
        };
      } else if (this.type == 3) {
        datas = {
          id: this.id,
          data: this.forminfo,
        };
      }
      CreateStore(datas).then((res) => {
        uni.hideLoading();
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    },
    // 上传头像
    uphead() {
      let that = this;
      uni.showLoading({
        title: "检测中...",
        mask: true,
      });
      uni.chooseImage({
        sizeType: ["compressed"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          // 单张压缩
          this.$refs.helangCompress
            .compress({
              src: res.tempFilePaths[0]
            })
            .then(async (res1) => {
              try {
                await this.$check.checkImg1(0, res1, tempFilePaths);
                uni.uploadFile({
                  url: that.action,
                  filePath: tempFilePaths[0],
                  name: "file",
                  header: {
                    token: uni.getStorageSync("token"),
                  },
                  success(res) {
                    const data = JSON.parse(res.data);
                    if (data.code == 200) {
                      that.forminfo.header = data.result.src;
                    } else {
                      uni.showToast({
                        title: data.message,
                        icon: "none",
                      });
                    }
                  },
                  complete() {
                    uni.hideLoading();
                  },
                });
              } catch (e) {
                uni.hideLoading();
              }
            })
            .catch((err) => {
              uni.hideLoading();
              uni.showToast({
                title: "上传失败",
              });
              console.log("eee", err);
            });
        },
      });
    },
    // 实体图
    async beforeUpload(index, lists) {
      uni.showLoading({
        title: "检测中...",
        mask: true,
      });
      try {
        await this.$refs.helangCompress
          .compress({
            src: lists[index].url,
          })
          .then(async (res) => {
            await this.$check.checkImg1(index, res, lists);
          });
      } catch (e) {
        console.log("e", e);
      }
    },
    onSuccess(data, index, lists, name) {
      if (data.code == 200) {
        this.forminfo.image.push(data.result.src);
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    onRemove(index, lists) {
      delImages({
        path: this.forminfo.image[index],
      }).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.forminfo.image.splice(index, 1);
        }
      });
    },
    // 店铺背景图
    async beforeUpload1(index, lists) {
      uni.showLoading({
        title: "检测中...",
        mask: true,
      });
      try {
        await this.$refs.helangCompress
          .compress({
            src: lists[index].url,
          })
          .then(async (res) => {
            await this.$check.checkImg1(index, res, lists);
          });
      } catch (e) {
        console.log("e", e);
      }
    },
    onSuccess1(data, index, lists, name) {
      if (data.code == 200) {
        this.forminfo.backimage = data.result.src;
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    onRemove1(index, lists) {
      delImages({
        path: this.forminfo.backimage,
      }).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.forminfo.backimage = "";
        }
      });
    },
  },
  onLoad: function (options) {
    this.forminfo.user_id = JSON.parse(uni.getStorageSync("user")).id;
    // 0：不是店家，1：是店家，2：申请中 3 修改店铺信息
    //
    this.type = options.type;
    if (options.type == 3) {
      uni.setNavigationBarTitle({
        title: "店铺信息设置",
      });
      this.id = options.shopId;
      storeDetail({
        id: options.shopId, //店铺id
      }).then((res) => {
        if (res.code == 200) {
          for (let i in this.forminfo) {
            this.forminfo[i] = res.result[i];
          }
          // 实体图预览
          for (let i in res.result.image) {
            this.fileList.push({
              url: getApp().globalData.imgBaseUrl + res.result.image[i],
            });
          }
          // 背景图预览
          if (res.result.backimage != "") {
            this.fileList1.push({
              url: getApp().globalData.imgBaseUrl + res.result.backimage,
            });
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.content {
  padding: 0 24rpx 36rpx;
  font-size: 28rpx !important;
}

.top1_1 {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 40rpx;
}

.top1_1 image {
  width: 136rpx;
  height: 136rpx;
  border-radius: 4px;
  margin: 120rpx 0 12rpx 0;
}

.top1_2 {
  padding-top: 52rpx;
}

.top1_2 input {
  height: 86rpx;
  line-height: 86rpx;
  border: none;
  background: #f9f9f9;
  margin-top: 24rpx;
  padding-left: 24rpx;
}

.top1_3 {
  padding-top: 120rpx;
}

.top1_3 .btn {
  line-height: 98rpx;
  text-align: center;
  background: #fec200;
  border-radius: 25px;
  font-size: 36rpx;
  margin-top: 40rpx;
}

.top1_3 > view:nth-of-type(1) {
  font-size: 30rpx;
  display: flex;
  align-items: center;
}

.top1_3 > view:nth-of-type(1) text {
  color: #1677ff;
}

.top2 {
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 36rpx;
}

.top2 image {
  width: 148rpx;
  height: 148rpx;
  margin-bottom: 50rpx;
}

.top2 > view:nth-of-type(2) {
  color: rgba(42, 40, 40, 0.4);
  font-size: 28rpx;
}

.popxy {
  width: 600rpx;
  height: 700rpx;
  overflow-y: scroll;
  padding: 20rpx;
  box-sizing: border-box;
}
</style>
