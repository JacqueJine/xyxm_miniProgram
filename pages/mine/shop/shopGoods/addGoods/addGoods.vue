<template>
  <view class="main">
    <view class="title">必填商品信息</view>
    <view class="inputGroup">
      <u-field
        v-model="formInfo.name"
        label="商品名称"
        label-width="150"
        placeholder="请输入名称（不超8个字）"
        maxlength="8"
      >
      </u-field>
      <u-field
        v-model="formInfo.price"
        label="价格（元）"
        label-width="150"
        placeholder="请输入价格"
      >
      </u-field>
    </view>
    <view class="title">是否设为热销商品（{{ shopHotNum }}/{{ hotNum }}）</view>
    <view class="inputGroup">
      <u-cell-item title="设为热销商品" :arrow="false">
        <u-switch v-model="formInfo.hot" @change="changeHot"></u-switch>
      </u-cell-item>
    </view>
    <view class="title">
      <view> 商品分类 </view>
      <view class="add" @click="toPage(2)">新建分类</view>
    </view>
    <view class="classList">
      <view
        :class="sel[index] == item.id ? 'classItem actClass' : 'classItem'"
        v-for="(item, index) in list"
        :key="index"
        @click="selClass(index, item.id)"
        >{{ item.name }}</view
      >
    </view>
    <view> </view>
    <view class="title">其他信息</view>
    <view class="inputGroup">
      <u-cell-item title="商品图片" :arrow="false" :title-style="titleStyle">
        <u-upload
          :action="action"
					:size-type="['compressed']"
          max-count="1"
          :file-list="fileList"
          @on-remove="onRemove"
          :show-tips="false"
          @on-success="onSuccess"
          ref="uUpload"
          :auto-upload="true"
					:before-upload="beforeUpload"
        ></u-upload>
      </u-cell-item>
    </view>
    <view class="inputGroup">
      <u-field
        v-model="formInfo.num"
        label="商品库存"
        placeholder="请输入库存数"
      >
      </u-field>
    </view>
    <view class="title">商品介绍（可不填）</view>
    <view class="inputGroup">
      <!-- <view class="last"></view> -->
      <view class="lastBtn">
        <u-button
          v-if="!hasIntroduce"
          @click="toPage(1)"
          shape="circle"
          :plain="true"
          >点击添加商品介绍</u-button
        >
        <u-button v-else @click="toPage(1)" shape="circle"
          >已添加，点击查看</u-button
        >
      </view>
    </view>
    <view class="foot">
      <view v-if="!isEdit" @click="toList(2)"> 保存为下架商品</view>
      <view v-if="!isEdit" @click="toList(1)"> 保存后上架</view>
      <view id="red" v-if="isEdit" @click="toList(3)"> 删除</view>
      <view v-if="isEdit" @click="toList(4)"> 保存</view>
    </view>
    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import {
  getClass,
  createGood,
  goodsDetail,
  hotCount,
  delGoods,
  editGoods,
} from "../../../../../services/shop.js";
import { getInfoSystem } from "../../../../../services/function.js";
import { delImages } from "../../../../../services/community.js";
import helangCompress from "@/components/helang-compress/helang-compress";
export default {
  components: {
    helangCompress,
  },
  data() {
    return {
      fileList: [],
      isEdit: false,
      hasIntroduce: false,
      titleStyle: {
        width: "130rpx",
      },
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
      list: [],
      hotNum: 0,
      shopHotNum: 0,
      sel: [],
      formInfo: {
        store_id: 1,
        class_id: [],
        name: "",
        price: "",
        hot: false,
        goodsimage: "",
        num: "",
        introduce: "",
        picture: [],
        shelves: 1,
      },
      id: "",
      loading: false,
    };
  },

  methods: {
    changeHot(value) {
      if (value) {
        if (this.shopHotNum >= this.hotNum) {
          uni.showToast({
            title: "热销商品已达到上限，无法添加",
            icon: "none",
          });
          this.formInfo.hot = false;
          return false;
        }
        this.shopHotNum++;
      } else {
        if (this.shopHotNum == 0) {
          return false;
        }
        this.shopHotNum--;
      }
    },
    // 选择class
    selClass(index, id) {
      if (this.sel[index] == id) {
        this.$set(this.sel, index, "");
      } else {
        this.$set(this.sel, index, id);
      }
    },
    toPage(index) {
      let url = "";
      if (index == 1) {
        url = "/pages/mine/shop/shopGoods/goodsInfo/goodsInfo";
      } else if (index == 2) {
        url = "/pages/mine/shop/shopGoods/goodsClass/goodsClass";
      }
      uni.navigateTo({
        url: url,
      });
    },
    // 图片上传
async beforeUpload(index, lists) {
			uni.showLoading({
				title: '检测中...',
				mask: true
			});
			try {
				await this.$refs.helangCompress
					.compress({
						src: lists[index].url
					})
					.then(async res => {
						await this.$check.checkImg1(index, res, lists);
					});
			} catch (e) {
				console.log('e', e);
			}
		},
    onSuccess(data, index, lists, name) {
      if (data.code == 200) {
        this.formInfo.goodsimage = data.result.src;
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    onRemove(index, lists) {
      delImages({
        path: this.forminfo.goodsimage,
      }).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.formInfo.goodsimage = "";
        }
      });
    },
    toList(index) {
      let that = this;

      this.formInfo.class_id = [];
      for (let i in this.sel) {
        if (this.sel[i] != "") {
          this.formInfo.class_id.push(this.sel[i]);
        }
      }
      // console.log(this.formInfo);
      this.formInfo.class_id = this.formInfo.class_id.toString();
      let regMoney = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/;
      if (index == 3) {
        uni.showModal({
          title: "警告",
          content: "确定要删除该商品吗",
          success: function (res) {
            if (res.confirm) {
              uni.showLoading({
                title: "提交中……",
                mask: true,
              });
              delGoods({
                id: that.id,
              }).then((res) => {
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
              // console.log('用户点击确定');
            } else if (res.cancel) {
              // console.log('用户点击取消');
            }
          },
        });
        return false;
      } else if (this.formInfo.name == "") {
        uni.showToast({
          title: "请输入名称",
          icon: "none",
        });
        return false;
      } else if (
        !regMoney.test(this.formInfo.price) ||
        Number(this.formInfo.price) >= 10000
      ) {
        uni.showToast({
          title: "请输入正确价格,且不能超过1万",
          icon: "none",
        });
        return false;
      } else if (this.formInfo.class_id.length < 1) {
        uni.showToast({
          title: "请选择商品分类",
          icon: "none",
        });
        return false;
      } else if (this.formInfo.goodsimage == "") {
        uni.showToast({
          title: "请选择商品图片",
          icon: "none",
        });
        return false;
      } else if (!/^[1-9]\d*$/.test(this.formInfo.num)) {
        uni.showToast({
          title: "请输入正确库存",
          icon: "none",
        });
        return false;
      }
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
      if (index == 1 || index == 2) {
        this.formInfo.shelves = index;
        createGood({
          data: this.formInfo,
        }).then((res) => {
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
      }
      // 编辑
      if (index == 4) {
        this.formInfo.id = this.id;
        editGoods({
          data: this.formInfo,
        }).then((res) => {
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
      }
    },
  },
  onLoad: function (options) {
    // 店铺商品分类
    getClass({
      id: 1, //店铺id
    }).then((res) => {
      if (res.code == 200) {
        this.list = res.result;
      }
    });
    uni.removeStorage({
      key: "goodsInfo",
      success: function (res) {
        // console.log('success');
      },
    });
    uni.setNavigationBarTitle({
      title: options.id ? "编辑商品" : "添加商品",
    });
    if (options.id) {
      this.isEdit = true;
      goodsDetail({
        id: options.id,
      }).then((res) => {
        if (res.code == 200) {
          for (let i in this.formInfo) {
            this.formInfo[i] = res.result[i];
          }
          this.id = res.result.id;
          // 商品图预览
          this.fileList = [
            {
              url: getApp().globalData.imgBaseUrl + res.result.goodsimage,
            },
          ];
          if (res.result.introduce == "" && res.result.picture.length < 1) {
            this.hasIntroduce = false;
          } else {
            let info = {};
            info.introduce = res.result.introduce;
            info.picture = res.result.picture;
            this.hasIntroduce = true;
            uni.setStorage({
              key: "goodsInfo",
              data: JSON.stringify(info),
            });
          }
          let arr = res.result.class_id.split(",");
          for (let i in this.list) {
            for (let j in arr) {
              if (this.list[i].id == arr[j]) {
                this.sel[i] = this.list[i].id;
              }
            }
          }
          console.log(this.sel);
        }
      });
    }

    // 后台设置的热销数量
    getInfoSystem({
      key: "热销商品数量",
    }).then((res) => {
      if (res.code == 200) {
        this.hotNum = res.result.value;
      }
    });
    // 本店铺的热销数量
    hotCount({
      id: 1, //店铺id
    }).then((res) => {
      if (res.code == 200) {
        this.shopHotNum = res.result.count;
      }
    });
  },
  onShow() {
    let that = this;
    uni.getStorage({
      key: "goodsInfo",
      success(res) {
        let options = JSON.parse(res.data);
        that.hasIntroduce = true;
        that.formInfo.introduce = options.introduce;
        that.formInfo.picture = options.picture;
      },
    });
  },
};
</script>

<style scoped>
.main {
  min-height: 100vh;
  background: #f2f2f2;
  box-sizing: border-box;
  padding: 16rpx 24rpx 108rpx;
}

.title {
  font-size: 24rpx;
  color: rgba(51, 51, 51, 0.4);
  margin-bottom: 16rpx;
  padding-top: 20rpx;
  display: flex;
  justify-content: space-between;
}

.inputGroup {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  overflow: hidden !important;
}

.add {
  color: rgba(22, 119, 255, 1);
}

.last {
  padding: 32rpx;
  font-size: 24rpx;
}

.lastBtn {
  display: flex;
  justify-content: center;
  margin: 60rpx 0;
}

.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 98rpx;
  background: #fff;
  box-shadow: 0px -1px 0px 0px rgba(196, 196, 196, 0.5);
  display: flex;
  justify-content: space-between;
  color: rgba(0, 145, 255, 1);
  font-size: 28rpx;
  z-index: 999;
}

.foot view {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.foot view:first-child {
  color: rgba(121, 121, 121, 1);
  border-right: 1px solid #f3f3f3;
}

#red {
  color: #ff3939;
}

.classList {
  display: flex;
  flex-wrap: wrap;
}

.classItem {
  font-size: 24rpx;
  padding: 0 13rpx;
  height: 54rpx;
  line-height: 54rpx;
  background: #fff;
  margin: 0 16rpx 16rpx 0;
  border: 2rpx solid #fff;
  border-radius: 2rpx;
}

.actClass {
  color: #1677ff;
  border: 2rpx solid #0091ff;
}
</style>
