<template>
  <view class="content">
    <view class="top1">{{ credit }}</view>
    <view class="top2">当前信誉分</view>
    <view class="top3">
      信誉分是平台展示个人信用的体现，初始分为100；
	  <br/>接单人完成任务后会增加积分;
	  <br/>接单人造成任务异常问题，被扣除信誉分；
	  <br/>如果在社区发布不良信息，也会被扣除信誉分；
	  <br/>当低于80分时将不能接单；
	  <br/>当低于50分时可能面临封号；
    </view>
    <view class="top4">
      <view class="title">信誉分变更记录</view>
      <view class="t2" v-for="(item, index) in list" :key="index">
        <view>
          <view>{{ item.note }}</view>
          <view class="time">{{ item.create_time }}</view>
        </view>
        <view class="num"
          >{{ item.status == 1 ? "+" : item.status == 2 ? "-" : ""
          }}{{ item.point }}</view
        >
      </view>
      <u-loadmore
        :status="status"
        :icon-type="iconType"
        :load-text="loadText"
      />
    </view>
  </view>
</template>

<script>
import { getUserCredits } from "../../../../services/mine.js";
export default {
  data() {
    return {
      list: [],
      credit: 0,
      page: 1,
      status: "loading",
      iconType: "flower",
      loadText: {
        loadmore: "轻轻上拉",
        loading: "努力加载中",
        nomore: "实在没有了",
      },
    };
  },
  methods: {
    getCredit() {
      if (this.noMore) {
        return false;
      }
      getUserCredits({
        page: this.page,
        limit: 10,
      }).then((res) => {
        if (res.code == 200) {
          this.list = this.list.concat(res.result.list);
          this.credit = res.result.credit;
          this.page++;
          if (res.result.count <= 10) {
            this.status = "nomore";
          }
        } else {
          this.status = "nomore";
        }
      });
    },
  },
  onLoad() {
    this.getCredit();
  },
  onReachBottom() {
    if (this.status == "nomore") {
      return false;
    }
    this.getCredit();
  },
};
</script>

<style scoped>
.content {
  padding: 0 24rpx;
  font-size: 24rpx;
}

.top1,
.top2 {
  text-align: center;
}

.top1 {
  font-size: 100rpx;
  font-weight: bold;
  padding: 72rpx 0 12rpx;
}

.top2 {
  font-size: 28rpx;
  color: rgba(36, 36, 36, 0.4);
}

.top3 {
  padding: 24rpx;
  color: rgba(36, 36, 36, 0.6);
  background: #f2f2f2;
  border-radius: 8px;
  margin: 48rpx 0 64rpx;
  font-size: 24rpx;
}

.title {
  margin: 20rpx 0;
  font-weight: bold;
}

.t2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  padding: 24rpx 0;
  border-bottom: 1px solid #f4f4f4;
}

.time {
  color: rgba(36, 36, 36, 0.4);
  margin-top: 8rpx;
  font-size: 24rpx;
}

.num {
  font-size: 32rpx;
  font-weight: bold;
}
.more {
  padding: 20rpx 0;
  text-align: center;
  color: #c8c9cc;
}
</style>
