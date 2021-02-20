<template>
  <view class="all">
    <view class="tabNav">
      <view class="navLeft">
        该页面为已{{ tabIndex == 1 ? "上架" : "下架" }}页面
      </view>
      <view class="navRight">
        <view
          :class="tabIndex == 1 ? 'actNav tab' : 'tab'"
          @click="changeTab(1)"
        >
          已上架
          <view class="actBar"></view>
        </view>
        <view
          :class="tabIndex == 0 ? 'actNav tab' : 'tab'"
          @click="changeTab(0)"
        >
          已下架
          <view class="actBar"></view>
        </view>
      </view>
    </view>
    <view class="body">
      <view class="bodyLeft">
        <view
          :class="
            'index' + '_' == classAct ? 'actClass classList' : 'classList'
          "
          @click="changeItem('', '')"
        >
          <image src="/static/mine/hot.png"></image> 热销
        </view>
        <view
          v-for="(item, idx) in list"
          :key="idx"
          :class="
            'index' + '_' + idx == classAct ? 'actClass classList' : 'classList'
          "
          @click="changeItem(idx, item.id)"
        >
          {{ item.name }}
        </view>
      </view>
      <view class="bodyRight">
        <view v-for="(item, index) in goods" :key="index">
          <image :src="imgBaseUrl + item.goodsimage" class="head"></image>
          <view class="mess">
            <view>{{ item.name }}</view>
            <view>
              <text>销量：{{ item.sales_num }}</text>
            </view>
            <view>
              <view style="color: #ff3939">
                <text>￥</text>
                <text style="font-size: 28rpx; font-weight: bold">{{
                  item.price
                }}</text>
              </view>
              <view>
                <view
                  v-if="tabIndex == 0"
                  class="goodsUp"
                  @click="changeStatus(item.id, 1)"
                  >上架</view
                >
                <view
                  v-if="tabIndex == 1"
                  class="goodsDown"
                  @click="changeStatus(item.id, 0)"
                  >下架</view
                >
                <view class="goodsEdit" @click="toPage(3, item.id)">编辑</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="foot">
      <view @click="toPage(1)">
        <image src="/static/mine/addClass.png"></image> 添加分类
      </view>
      <view @click="toPage(2)">
        <image src="/static/mine/addGoods.png"></image> 添加商品
      </view>
    </view>
  </view>
</template>

<script>
import { getClass, getGood, editGoods } from "../../../../../services/shop.js";
export default {
  data() {
    return {
      tabIndex: 1,
      classAct: "index_",
      list: [],
      goods: [],
      class_id: 0,
      page: 1,
      imgBaseUrl: getApp().globalData.imgBaseUrl,
      noMore: false,
      shop_id: 1,
    };
  },
  methods: {
    toPage(index, id) {
      let url = "";
      if (index == 1) {
        url = "/pages/mine/shop/shopGoods/goodsClass/goodsClass";
      } else if (index == 2) {
        url = "/pages/mine/shop/shopGoods/addGoods/addGoods";
      } else if (index == 3) {
        url = `/pages/mine/shop/shopGoods/addGoods/addGoods?id=${id}`;
      }
      uni.navigateTo({
        url: url,
      });
    },
    getgoods() {
      let data = {};
      if (this.classAct == "index_") {
        data = {
          where: {
            store_id: this.shop_id,
            shelves: this.tabIndex,
          },
          page: this.page,
          limit: 10,
        };
      } else {
        data = {
          where: {
            store_id: this.shop_id,
            class_id: this.class_id,
            shelves: this.tabIndex,
          },
          page: this.page,
          limit: 10,
        };
      }
      getGood(data).then((res) => {
        if (res.code == 200) {
          this.goods = this.goods.concat(res.result.data);
          this.page++;
        } else {
          this.noMore = true;
        }
      });
    },
    // 切换分类
    changeItem(index, id) {
      this.noMore = false;
      this.classAct = "index" + "_" + index;
      this.page = 1;
      this.goods = [];
      if (id != "") {
        this.class_id = id;
      }
      this.getgoods();
    },
    // 切换tab
    changeTab(index) {
      this.noMore = false;
      // index
      uni.setNavigationBarTitle({
        title: index == 1 ? "上架商品" : index == 0 ? "下架商品" : "",
      });
      this.tabIndex = index;
      this.page = 1;
      this.goods = [];
      this.getgoods();
    },
    changeStatus(id, status) {
      uni.showModal({
        title: "警告",
        content:
          status == 1 ? "确定要将该商品上架" : "确定要将该商品下架" + "吗？",
        success: (res) => {
          if (res.confirm) {
            editGoods({
              data: {
                id: id,
                shelves: status,
              },
            }).then((res) => {
              uni.showToast({
                title: res.message,
                icon: "none",
              });
              if (res.code == 200) {
                this.noMore = false;
                this.page = 1;
                this.goods = [];
                this.getgoods();
              }
            });
          } else if (res.cancel) {
          }
        },
      });
    },
  },
  onReachBottom() {
    if (this.noMore) {
      return false;
    }
    this.getgoods();
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: options.id == 1 ? "上架商品" : options.id == 0 ? "下架商品" : "",
    });
    this.tabIndex = options.id;
  },
  onShow() {
    this.page = 1;
    this.goods = [];
    getClass({
      id: 1, //店铺id
    }).then((res) => {
      if ((res.code = 200)) {
        this.list = res.result;
        this.getgoods();
      }
    });
  },
};
</script>

<style scoped>
.all {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  min-height: 100vh;
}

.tabNav {
  height: 100rpx;
  box-sizing: border-box;
  padding: 36rpx 24rpx;
  color: #b5b5b5;
  font-size: 24rpx;
  display: flex;
  justify-content: space-between;
}

.navRight {
  display: flex;
}

.navRight .tab {
  margin: 0 20rpx;
}

.navRight .actNav {
  color: #333;
  position: relative;
}

.actNav .actBar {
  display: block;
}

.actBar {
  display: none;
  position: absolute;
  width: 92%;
  height: 4rpx;
  background: #333;
  left: 0;
  right: 0;
  margin: auto;
  bottom: -6rpx;
}

.body {
  flex: 1;
  display: flex;
  padding-bottom: 100rpx;
}

.bodyLeft {
  width: 144rpx;
  padding: 16rpx 0;
  background: #f3f3f3;
}

.bodyLeft .actClass {
  color: rgba(51, 51, 51, 1);
  background: #fff;
}

.bodyLeft .classList:first-child {
  color: rgba(255, 48, 40, 1);
}

.classList {
  padding: 28rpx 0;
  font-size: 24rpx;
  color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
}

.classList image {
  width: 26rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.bodyRight {
  flex: 1;
}

.bodyRight > view {
  display: flex;
  margin-top: 24rpx;
  padding: 0 24rpx;
}

.bodyRight > view:nth-of-type(1) {
  margin-top: 0;
}

.bodyRight .head {
  width: 192rpx;
  height: 192rpx;
  border-radius: 4px;
  margin-right: 20rpx;
}

.bodyRight {
  font-size: 24rpx;
  color: rgba(51, 51, 51, 0.4);
  overflow-y: scroll;
}

.bodyRight .mess {
  flex: 1;
}

.bodyRight .mess > view:nth-of-type(1) {
  color: rgba(51, 51, 51, 1);
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  height: 80rpx;
}

.bodyRight .mess image {
  width: 50rpx;
  height: 50rpx;
}

.bodyRight .mess > view:nth-of-type(3) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.bodyRight .mess > view:nth-of-type(3) view:nth-of-type(2) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.bodyRight .mess > view:nth-of-type(3) view:nth-of-type(2) text {
  margin: 0 16rpx;
  font-size: 32rpx;
  color: #000;
}

.goodsUp {
  padding: 6rpx 20rpx;
  border-radius: 4rpx;
  color: rgba(0, 200, 91, 1);
  font-size: 24rpx;
  background: rgba(0, 200, 91, 0.1);
  margin-right: 24rpx;
}

.goodsDown {
  padding: 6rpx 20rpx;
  border-radius: 4rpx;
  color: rgba(255, 57, 57, 1);
  font-size: 24rpx;
  background: rgba(255, 57, 57, 0.1);
  margin-right: 24rpx;
}

.goodsEdit {
  padding: 6rpx 20rpx;
  border-radius: 4rpx;
  color: rgba(0, 145, 255, 1);
  font-size: 24rpx;
  background: rgba(0, 145, 255, 0.1);
}

.foot {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 98rpx;
  background: #fff;
  box-shadow: 0px -1px 0px 0px rgba(196, 196, 196, 0.5);
  display: flex;
  justify-content: space-between;
  color: rgba(0, 145, 255, 1);
  font-size: 28rpx;
}

.foot view {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.foot view:first-child {
  border-right: 1px solid #f3f3f3;
}

.foot image {
  width: 38rpx;
  height: 38rpx;
  margin-right: 16rpx;
}
</style>
