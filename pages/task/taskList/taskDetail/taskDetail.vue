<template>
  <view class="all" v-if="alldata != ''">
    <!-- 订单状态 -->
    <view class="orderS">
      <view>任务状态</view>
      <view style="display: flex; align-items: center; font-size: 40rpx">
        <u-icon
          name="clock"
          size="40rpx"
          style="margin: 2rpx 6rpx 0 0"
          v-if="alldata.task_state == 0"
        ></u-icon>
        <u-icon
          name="checkmark-circle"
          size="40rpx"
          style="margin: 2rpx 6rpx 0 0"
          v-else
        ></u-icon>
        {{ alldata.task_state == 0 ? "待接单" :alldata.task_state == 4 ? "已完成" : "已接单" }}
      </view>
    </view>
    <!-- 顶部人员信息 -->
    <view class="t1">
      <view class="per-t">
        <view class="issuer1">
          <view class="head">
            <image
              class="imgInfo"
              :src="
                alldata.user_info.header == ''
                  ? '/static/mine/name1.png'
                  : imgBaseUrl + alldata.user_info.header
              "
            ></image>
            <image
              v-if="alldata.user_info.show_attestation"
              class="is_auth"
              :src="
                alldata.user_info.show_attestation == 1
                  ? '/static/index/is_auth.png'
                  : alldata.user_info.show_attestation == 2
                  ? '/static/index/is_shop.png'
                  : alldata.user_info.show_attestation == 3
                  ? '/static/index/is_rider.png'
                  : ''
              "
            ></image>
          </view>
          <view class="user">
            <view class="user-t user-tt" id="">
              <view class="name">
                {{ alldata.user_name }}
              </view>
              <image
                class="gender"
                v-if="alldata.user_info.sex.code != 0"
                :src="
                  alldata.user_info.sex.code == 1
                    ? '/static/index/man.png'
                    : '/static/index/female.png'
                "
              ></image>
              <image
                class="gender"
                v-if="alldata.user_info.is_store.code == 1"
                src="/static/mine/shop.png"
              ></image>
              <view>
                <text class="xinyu">信誉{{ alldata.user_info.credit }}</text>
              </view>
            </view>
            <view class="user-t">
              <view class="time">{{ alldata.create_time }}</view>
              <!-- <view class="location">学校</view> -->
            </view>
          </view>
        </view>
        <u-icon name="more-dot-fill" size="42rpx" @click="moreBtn(1)"></u-icon>
      </view>

      <view class="per-c">
        <view class="per-c-l">
          <text>{{ alldata.title }}</text>
          <!-- 加急图片 -->
          <image
            class="imgInfo"
            v-if="alldata.type == 2 && alldata.is_good_prepay == 1"
            src="/static/index/yu.png"
          ></image>
          <image
            class="imgInfo"
            v-if="alldata.is_urgent == 1"
            src="/static/index/ji.png"
          ></image>
        </view>
        <view class="per-c-r">
          <text>￥{{ alldata.task_price_total }}</text>
        </view>
      </view>
      <view class="ji">
        <text>跑腿费</text>
        <text>{{ alldata.money }}元</text>
      </view>
      <view class="ji" v-if="alldata.type == 2 && alldata.is_good_prepay == 1">
        <text>商品预付费</text>
        <text>{{ alldata.good_prepay }}元</text>
      </view>
      <view class="ji" v-if="alldata.is_urgent == 1">
        <text>加急费（平台收取{{ alldata.urgent_price_rate }}%手续费）</text>
        <text>{{ alldata.urgent_price }}元</text>
      </view>
      <view class="ji" v-if="alldata.is_urgent == 1">
        <text>实际到手</text>
        <text>{{ truemoney }}元</text>
      </view>
    </view>
    <view class="yufu" v-if="alldata.type == 2 && alldata.is_good_prepay == 1">
      该任务赏金包含 {{ alldata.good_prepay }}元
      商品预付金额，先由接单者垫付商品金额完成任务后直接到账余额没有任何手续费，若垫付金额与实际金额有差额请及时与发布者沟通
    </view>
    <!-- 中间帮取快递信息 -->
    <view class="center">
      <view class="center-per">
        <!-- 快递 -->
        <view v-if="alldata.type == 1">
          <view
            :style="
              index > 0
                ? 'padding-top:32rpx;border-bottom: 1px solid #f2f2f2'
                : 'border-bottom: 1px solid #f2f2f2'
            "
            v-for="(item, index) in alldata.task_expressage"
            :key="index"
          >
            <view class="takePlace">
              <view class="dot red"></view>
              <view class="cp-t">取件地点：</view>
              <view class="cp-c">{{ item.task_address }}</view>
            </view>
            <view class="deliveryPlace">
              <view class="dot blue"></view>
              <view class="cp-t">送件地点：</view>
              <view class="cp-c">{{ item.destination }}</view>
            </view>
          </view>
        </view>
        <!-- 跑腿 -->
        <view style="border-bottom: 1px solid #f2f2f2" v-if="alldata.type == 2">
          <view class="takePlace">
            <view class="dot red"></view>
            <view class="cp-t">取件地点：</view>
            <view class="cp-c">{{ alldata.task_address }}</view>
          </view>
          <view class="deliveryPlace">
            <view class="dot blue"></view>
            <view class="cp-t">送件地点：</view>
            <view class="cp-c">{{ alldata.destination }}</view>
          </view>
        </view>
        <!-- 其他任务 -->
        <view v-if="alldata.type == 3">
          <view class="takePlace">
            <view class="dot red"></view>
            <view class="cp-t">任务内容：</view>
            <view class="cp-c">{{ alldata.express_desc }}</view>
          </view>
        </view>
        <view class="deliveryPlace" v-if="alldata.type != 3">
          <view class="dot" style="background: #00c85b"></view>
          <view class="cp-t">送件时间：</view>
          <view class="cp-c">{{ alldata.destination_time.text }} 前</view>
        </view>
        <view class="takePlace" v-if="alldata.type != 3">
          <view class="cp-t">备注：</view>
          <view class="cp-c notes-c">{{ alldata.comment }}</view>
        </view>
      </view>
    </view>
    <view class="bottom2" @click="takeOrder" v-if="alldata.task_state == 0">
      <text>我要接单</text>
    </view>
    <!-- 留言 -->
    <view class="liuyan">
      <view style="margin-bottom: 24rpx">全部留言（{{ allLiu }}）</view>
      <view>
        <LeaveMess
          @toMinePage="toMinePage"
          :curHelpInfo="liuList"
          @moreBtn="moreBtn1"
          @showPop="showPop"
          @showhf="showhf"
          @showWrite="showWrite()"
          @praise="toPraise"
        ></LeaveMess>
      </view>
      <u-loadmore
        :status="status"
        :icon-type="iconType"
        :load-text="loadText"
      />
      <!-- 			<view class="liulist">
				<view style="font-size: 24rpx;display: flex;align-items: center;">
					<image src="/static/index/1.png"></image>李优秀
				</view>
				<view style="padding-left:64rpx">
					<view class="liulist_title">我去啊 啊啊啊 啊接不了 啊难受</view>
					<view class="liulist_time">17:08</view>
					<view style="margin-top:30rpx">
						<view style="font-size: 24rpx;display: flex;align-items: center;">
							<image src="/static/index/1.png"></image>李优秀
						</view>
						<view style="padding-left:64rpx">
							<view class="liulist_title">我去啊 啊啊啊 啊接不了 啊难受</view>
							<view class="liulist_time">17:08</view>
						</view>
					</view>

				</view>

			</view> -->
    </view>
    <!-- 底部固定 -->
    <view class="foot">
      <view class="toliuyan" @click="showWrite()"> 我要留言…… </view>
    </view>
    <!-- 弹窗 -->
    <!-- 举报 -->
    <u-popup
      v-model="showModal"
      mode="center"
      border-radius="8"
      z-index="19999"
    >
      <view class="modalDlg3">
        <view class="t">我要举报</view>
        <view class="note">注：举报成功获得奖励，恶意举报将会受到惩罚</view>
        <textarea
          placeholder-style="font-size:14px;color:rgba(36,36,36,0.6);line-height:20px;"
          placeholder="请输入举报内容(不超过100字)"
          maxlength="100"
          v-model="inform"
          class="textarea"
        ></textarea>
        <view class="btn">
          <view @click="showModal = false">取消</view>
          <view class="submit" @click="submit">提交</view>
        </view>
      </view>
    </u-popup>
    <!-- 留言 -->
    <u-popup
      v-model="showliuyan"
      mode="top"
      :safe-area-inset-bottom="true"
      z-index="10099"
      @open="textFocus = true"
      @close="textFocus = false"
    >
      <view class="writeReply">
        <view>
          <view>
            <textarea
              :focus="textFocus"
              v-model="comment"
              :placeholder="comment_up_id == 0 ? '留言…' : placeholder"
              style="text-align: left"
            ></textarea>
          </view>
          <view>
            <u-upload
              :action="action"
					:size-type="['compressed']"
              max-count="9"
              width="120"
              height="120"
              @on-remove="onRemove"
              :show-tips="false"
              ref="uUpload"
              :auto-upload="true"
				:before-upload="beforeUpload"
              @on-success="onSuccess"
            ></u-upload>
          </view>
        </view>
        <view>
          <text @click="addComm">发送</text>
        </view>
      </view>
    </u-popup>
    <!-- 回复详情 -->
    <u-popup v-model="showReply" mode="bottom" border-radius="20">
      <view class="reply">
        <view>
          <text @click="showReply = !showReply" class="close">关闭</text>
          回复详情
        </view>
        <scroll-view :scroll-y="true" class="scrollY" @scrolltolower="onBottom">
          <view style="padding: 114rpx 24rpx 24rpx">
            <LeaveMess1
              @toMinePage="toMinePage"
              :leaveMess="huiList"
              @praise="toPraise"
              @moreBtn="moreBtn1"
              @showPop="showPop"
              @showWrite="showWrite1()"
            ></LeaveMess1>
          </view>
        </scroll-view>
      </view>
    </u-popup>
    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import LeaveMess from "@/components/perFunctionInfo/leaveMess/leaveMess.vue";
import LeaveMess1 from "@/components/perFunctionInfo/leaveMess1/leaveMess.vue";
import helangCompress from "@/components/helang-compress/helang-compress";
import {
  getInfoTask,
  listComment,
  insertComment,
  delComment,
  Praise,
  Inform,
  liuInform,
  createOrder,
} from "../../../../services/function.js";
import { findUserInfo } from "../../../../services/mine.js";
import { delImages } from "../../../../services/community.js";
export default {
  components: {
    LeaveMess,
    LeaveMess1,
    helangCompress,
  },
  data() {
    return {
      truemoney: 0,
      textFocus: false,
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
      navTop: getApp().globalData.navTop,
      navHeight: getApp().globalData.navHeight,
      showliuyan: false,
      showModal: false,
      showReply: false,
      userInfo: [
        {
          head: "/static/index/1.png",
          userName: "李优秀",
          gender: 0,
          time: "10分钟前",
          userUniversity: "郑州大学",
          status: 1,
          expressNum: 5,
          price: 10,
        },
      ],
      alldata: "",
      // 留言
      page: 1,
      page1: 1,
      liuList: [],
      allLiu: 0,
      huiList: [],

      comment: "",
      img: [],
      fid: 0,
      imgBaseUrl: getApp().globalData.imgBaseUrl,
      comment_up_id: 0,
      placeholder: "",
      up_user_id: "",
      // 举报
      inform: "",
      juType: 2, //2任务 1留言
      // 评论举报
      task_comment_id: "",
      inform_user_id: "",
      // 没有更多
      status: "loading",
      iconType: "flower",
      loadText: {
        loadmore: "轻轻上拉",
        loading: "努力加载中",
        nomore: "实在没有了",
      },
      // 评论分类
      is_Write1: false,
      // 内部评论
      status1: "loading",
    };
  },
  methods: {
    // 内部评论触底
    onBottom() {
      if (this.status1 == "nomore") {
        return false;
      }
      this.getliu();
    },
    // 展示评论
    showWrite(index, up_user_id) {
      // 消息提醒 :新的评论回复
      uni.requestSubscribeMessage({
        tmplIds: ["Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y"],
        complete: (res) => {
          // 不管成功失败都执行添加任务
          this.is_Write1 = false;
          this.comment = "";
          this.comment_up_id = 0;
          this.img = [];
          this.$refs["uUpload"].clear();
          if (index == undefined) {
            // 第一层
            this.fid = 0;
            this.up_user_id = this.alldata.user_id;
          } else {
            // 第二层
            this.fid = index;
            this.up_user_id = up_user_id;
          }
          this.showliuyan = !this.showliuyan;
        },
      });
    },
    showWrite1(index, up_user_id, user_name) {
      // 消息提醒:新的评论回复
      uni.requestSubscribeMessage({
        tmplIds: ["Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y"],
        complete: (res) => {
          // 不管成功失败都执行添加任务
          this.is_Write1 = true;
          this.img = [];
          this.$refs["uUpload"].clear();
          // 第三层
          this.placeholder = "回复 @" + user_name + "：";
          this.comment = "";
          this.comment_up_id = index;
          this.up_user_id = up_user_id;
          this.showliuyan = !this.showliuyan;
        },
      });
    },
    // 评论列表
    getList() {
      listComment({
        where: {
          task_id: this.alldata.id,
        },
        limit: 10,
        page: this.page,
      }).then((res) => {
        if (res.code == 200) {
          this.allLiu = res.result.count;
          this.liuList = this.liuList.concat(res.result.data);
          this.page++;
          if (res.result.count <= 10) {
            this.status = "nomore";
          }
        } else {
          this.status = "nomore";
        }
      });
    },
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
    // 上传成功图片
    onSuccess(data, index, lists, name) {
      if (data.code == 200) {
        this.img.push({
          path: data.result.src,
        });
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    onRemove(index, lists) {
      delImages(this.img[index]).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.img.splice(index, 1);
        }
      });
    },
    // 点赞
    toPraise(type, task_comment_id, praise_user_id, index, page) {
      Praise({
        data: {
          type: type,
          task_comment_id: task_comment_id,
          praise_user_id: praise_user_id,
          user_id: JSON.parse(uni.getStorageSync("user")).id,
        },
      }).then((res) => {
        if (res.code == 200) {
          if (page == 0) {
            if (type == 1) {
              this.liuList[index].is_praise = true;
              this.liuList[index].praise_count++;
              this.$forceUpdate();
            } else {
              this.liuList[index].is_praise = false;
              this.liuList[index].praise_count--;
              this.$forceUpdate();
            }
          } else {
            // console.log(this.huiList, index);
            if (type == 1) {
              this.huiList[index].is_praise = true;
              this.huiList[index].praise_count++;
              this.$forceUpdate();
            } else {
              this.huiList[index].is_praise = false;
              this.huiList[index].praise_count--;
              this.$forceUpdate();
            }
          }
        }
      });
    },
    // 添加评论
    async addComm() {
      if (this.comment == "" && this.img.length < 1) {
        uni.showToast({
          title: "内容和图片至少选择一样评论",
          icon: "none",
        });
        return false;
      }
      // 文本检测
      try {
        let res = await this.$check.checkTxt(this.comment);
      } catch (error) {
        this.comment = "";
        return false;
      }
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
      insertComment({
        task_id: this.alldata.id,
        data: {
          fid: this.fid,
          // user_id: JSON.parse(uni.getStorageSync("user")).id,
          comment: this.comment,
          img: this.img,
          comment_up_id: this.comment_up_id,
          up_user_id: this.up_user_id,
        },
      }).then((res) => {
        uni.hideLoading();
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          // this.is_Write1=false;
          this.showliuyan = !this.showliuyan;
          if (this.is_Write1) {
            this.page1 = 1;
            this.huiList = [];
            this.status1 = "loading";
            this.getliu();
          } else {
            this.page = 1;
            this.liuList = [];
            this.status = "loading";
            this.getList();
            // this.showReply = false;
          }
        }
      });
    },
    // 留言
    moreBtn1(id, uid) {
      let that = this;
      uni.showActionSheet({
        itemList:
          JSON.parse(uni.getStorageSync("user")).id == uid
            ? ["我要删除"]
            : ["我要举报"],
        itemColor:
          JSON.parse(uni.getStorageSync("user")).id == uid
            ? "#ff0000"
            : "#000000",
        success(res) {
          if (JSON.parse(uni.getStorageSync("user")).id != uid) {
            that.inform = "";
            that.juType = 1;
            that.task_comment_id = id;
            that.inform_user_id = uid;
            that.showModal = !that.showModal;
          } else {
            uni.showModal({
              title: "警告",
              content: "确定要删除该评论吗",
              success: function (res) {
                if (res.confirm) {
                  delComment({
                    id: id,
                    user_id: JSON.parse(uni.getStorageSync("user")).id,
                  }).then((res) => {
                    uni.showToast({
                      title: res.message,
                      icon: "none",
                    });
                    that.status = "loading";
                    if (res.code == 200) {
                      that.page = 1;
                      that.liuList = [];

                      // 评论
                      listComment({
                        where: {
                          task_id: that.alldata.id,
                        },
                        limit: 10,
                        page: that.page,
                      }).then((res) => {
                        if (res.code == 200) {
                          that.allLiu = res.result.count;
                          that.liuList = that.liuList.concat(res.result.data);
                          that.page++;
                          that.showReply = false;
                          if (res.result.count <= 10) {
                            that.status = "nomore";
                          }
                        } else {
                          that.allLiu = 0;
                          that.status = "nomore";
                        }
                      });
                    }
                  });
                } else if (res.cancel) {
                  // console.log('用户点击取消');
                }
              },
            });
          }
          // console.log(res.tapIndex, id);
        },
        fail(res) {
          console.log(res.errMsg);
        },
      });
    },
    // 任务
    moreBtn(id) {
      let that = this;
      uni.showActionSheet({
        itemList: ["我要举报"],
        success(res) {
          if (res.tapIndex == 0) {
            that.inform = "";
            that.juType = 2;
            that.showModal = !that.showModal;
          }
          // console.log(res.tapIndex, id);
        },
        fail(res) {
          console.log(res.errMsg);
        },
      });
    },
    // 举报
    submit() {
      if (this.inform == "") {
        uni.showToast({
          title: "请输入举报内容",
          icon: "none",
        });
        return false;
      }
      let data = {};
      // 评论
      if (this.juType == 1) {
        data = {
          task_comment_id: this.task_comment_id,
          inform_user_id: this.inform_user_id,
          inform: this.inform,
        };
        liuInform({
          data: data,
        }).then((res) => {
          uni.showToast({
            title: res.message,
            icon: "none",
          });
          if (res.code == 200) {
            this.showModal = !this.showModal;
          }
        });
      }
      // 任务
      else {
        data = {
          task_id: this.alldata.id,
          inform_user_id: this.alldata.user_id,
          inform: this.inform,
        };
        Inform({
          data: data,
        }).then((res) => {
          uni.showToast({
            title: res.message,
            icon: "none",
          });
          if (res.code == 200) {
            this.showModal = !this.showModal;
          }
        });
      }
    },
    // 回复
    showhf(id) {
      this.page1 = 1;
      this.huiList = [];
      this.fid = id;
      uni.showLoading({
        title: "加载中",
      });
      this.showReply = !this.showReply;
      this.getliu();
    },
    getliu() {
      listComment({
        where: {
          fid: this.fid,
        },
        limit: 10,
        page: this.page1,
      }).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.huiList = this.huiList.concat(res.result.data);
          this.page1++;
          if (res.result.count <= 10) {
            this.status1 = "nomore";
          }
        } else {
          this.status1 = "nomore";
        }
      });
    },
    toMinePage(id) {
      uni.navigateTo({
        url: "/pages/community/minePage/minePage?id=" + id,
      });
    },
    // 图片预览
    showPop(item, index) {
      let imgs = [];
      item.forEach((img) => {
        imgs.push(this.imgBaseUrl + img.path);
      });
      uni.previewImage({
        current: index,
        urls: imgs,
      });
    },
    // 接单
    takeOrder() {
      findUserInfo({}).then((res) => {
        if (res.code == 200) {
          uni.setStorageSync("user", JSON.stringify(res.result));
          if (res.result.is_rider.code == 1 && res.result.credit > 79) {
            this.takeOrder1();
          } else if (res.result.is_rider.code != 1) {
            uni.showToast({
              title: "成为骑手后才能接任务!",
              duration: 3000,
              icon: "none",
            });
          } else if (res.result.credit < 80) {
            uni.showToast({
              title: "信誉分过低无法接单!",
              duration: 3000,
              icon: "none",
            });
          }
        }
      });
    },
    // 接单接口
    takeOrder1() {
      uni.showModal({
        title: "温馨提示",
        content: "接单后未完成订单，将扣除您的信誉分，信誉分过低将无法接单。",
        cancelText: "取消",
        confirmText: "确认",
        confirmColor: "#FFDD05",
        success: (res) => {
          if (res.cancel) {
            // 用户点击了取消属性的按钮
            // console.log("取消");
          } else if (res.confirm) {
            // 消息提醒 : 服务进度通知、收益到账、项目任务开始，
            uni.requestSubscribeMessage({
              tmplIds: [
                "VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI",
                "RWiuB1VJcmw94MDR-sZVdUfUTkg7MwPOks4kpA45XxQ",
                "TwDXAfPjCKJkjCR3s4IX_cYSjRdYTPBYp9sl7z6zRuc",
              ],
              complete: (res) => {
                // 不管成功失败都执行添加任务
                uni.showLoading({
                  title: "接单中……",
                  mask: true,
                });
                // 用户点击了确定属性的按钮
                // console.log("确认");
                createOrder({
                  data: {
                    task_id: this.alldata.id,
                    task_user_id: this.alldata.user_id,
                    task_type: this.alldata.type,
                  },
                }).then((res) => {
                  uni.hideLoading();
                  if (res.code == 200) {
                    uni.reLaunch({
                      url:
                        "/pages/mine/acceptOrder/orderDetail/orderDetail?id=" +
                        res.result.order_id,
                    });
                  } else {
                    uni.showToast({
                      title: res.message,
                      icon: "none",
                    });
                  }
                });
              },
            });
          }
        },
      });
    },
  },
  onReachBottom() {
    if (this.status == "nomore") {
      return false;
    }
    this.status == "loading";
    this.getList();
    // this.getliu();
  },
  onLoad(options) {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
    getInfoTask({
      id: options.id,
    }).then((res) => {
      uni.hideLoading();
      if (res.code == 200) {
        this.alldata = res.result;
        this.getList();
        // this.$Numcheck.rounding
        // this.truemoney = (Number(this.alldata.true_urgent_price) + Number(this.alldata.good_prepay) + Number(this.alldata
        // 	.money)).toFixed(2);
        this.truemoney = this.$Numcheck.rounding(
          Number(this.alldata.true_urgent_price) +
            Number(this.alldata.good_prepay) +
            Number(this.alldata.money),
          2
        );
      }
    });
  },
};
</script>

<style scoped>
.all {
  min-height: 100vh;
  background: rgba(245, 245, 245, 1);
  display: flex;
  flex-direction: column;
  overflow: auto;
  text-align: center;
  padding: 32rpx;
  box-sizing: border-box;
}

/* 第一大块 */

.orderS {
  background: #fec200;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
  font-size: 24rpx;
}

/* 01 */

.t1 {
  width: 100%;
  /* height: 242rpx; */
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  padding: 32rpx;
  box-sizing: border-box;
  margin-bottom: 32rpx;
}

.per-t {
  height: 80rpx;
  line-height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.per-t .issuer1 {
  height: 100%;
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.per-t .issuer1 .user {
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  width: 370rpx;
  margin-left: 16rpx;
  /* justify-content: space-between; */
}

.head {
  position: relative;
  height: 90rpx;
}

.head .is_auth {
  position: absolute;
  bottom: 8rpx;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  z-index: 10;
}

.user .user-t {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 24rpx;
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
}

.user-tt {
  display: block;
  margin-bottom: 10rpx;
}

.name {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 28rpx;
  color: #333333;
  float: left;
  font-weight: bold;
}

.per-t image {
  height: 80rpx;
  width: 80rpx;
}

.per-t .gender {
  float: left;
  height: 28rpx;
  width: 28rpx;
  margin-left: 10rpx;
  position: relative;
}

.xinyu {
  color: #0091ff;
  font-size: 20rpx;
  padding: 0 6rpx;
  border-radius: 2px;
  background: #e5f4ff;
  margin-left: 12rpx;
}

.time {
  color: rgba(36, 36, 36, 0.4);
  margin-right: 10rpx;
  font-size: 24rpx;
}

.location {
  color: rgba(36, 36, 36, 0.4);
  font-size: 24rpx;
}

.per-c {
  /* height: 80rpx;
		line-height: 80rpx; */
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 15rpx 0 0;
}

.per-c-l {
  height: 100%;
  width: 70%;
  font-size: 36rpx;
  color: #333333;
  text-align: left;
  font-weight: bold;
}

.per-c-l image {
  height: 32rpx;
  width: 56rpx;
  margin-left: 20rpx;
  position: relative;
  top: 4rpx;
}

.per-t .imgInfo {
  height: 80rpx;
  width: 80rpx;
  border-radius: 50%;
}

.per-c-r {
  height: 100%;
  width: 30%;
  font-size: 48rpx;
  color: #ff4d06;
  text-align: right;
  font-weight: bold;
}

/* 垫付 */
.yufu {
  background: #f2ecd9;
  border-radius: 8px;
  font-size: 24rpx;
  color: rgba(36, 36, 36, 0.6);
  padding: 28rpx 32rpx;
  margin: 0 0 32rpx;
  text-align: left;
}

.ji {
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.ji > text:nth-of-type(1) {
  color: rgba(51, 51, 51, 0.4);
}

/* 02 */

.center {
  width: 100%;
  height: auto;
  /* margin-top: 32rpx; */
}

.center-per {
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  padding: 32rpx;
  box-sizing: border-box;
  color: rgba(36, 36, 36, 0.4);
  font-size: 20rpx;
  text-align: left;
  padding-left: 68rpx;
  margin-bottom: 40rpx;
}

.takePlace {
  /* height: 100rpx; */
  width: 100%;
  position: relative;
}

.deliveryPlace {
  margin-top: 30rpx;
  margin-bottom: 10rpx;
  /* height: 100rpx; */
  width: 100%;
  position: relative;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: rgba(255, 112, 5, 1);
  position: absolute;
  left: -30rpx;
  top: 10rpx;
  border-radius: 50%;
}

.cp-t {
  font-size: 20rpx;
}

.cp-c {
  font-size: 32rpx;
  color: #333333;
  width: 100%;
  font-weight: 400;
  padding-top: 24rpx;
}

.notes-c {
  color: rgba(36, 36, 36, 0.4);
}

.blue {
  background: #346cff;
}

.mess {
  width: 343px;
  height: 190rpx;
  background: #fec200;
  border-radius: 8px;
  padding: 0 68rpx;
  box-sizing: border-box;
  margin-bottom: 32rpx;
}

.mess_1 {
  font-size: 24rpx;
  padding: 24rpx 0 18rpx 0;
}

/* 03 */

.bottom {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
}

.bottom_1 {
  line-height: 320rpx;
  text-align: center;
  font-size: 36rpx;
  color: rgba(36, 36, 36, 0.2);
  font-weight: bold;
}

.bottom_2 {
  color: #333333;
  font-size: 32rpx;
  text-align: left;
  height: 320rpx;
  padding: 32rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.bottom_2_1 {
  font-size: 24rpx;
  background: #fec200;
  border-radius: 4px;
  padding: 12rpx 30rpx;
}

/* 04 */

.bottom2 {
  margin: 0 auto 40rpx;
  width: 402rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #fec200;
  border-radius: 24px;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

/* 弹出层，举报 */

.modalDlg3 {
  width: 592rpx;
  height: 400rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  text-align: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.modalDlg3 .textarea {
  width: 516rpx;
  height: 156rpx;
  background: rgba(216, 216, 216, 0.5);
  text-align: left;
  opacity: 0.6;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
}

.modalDlg3 .btn {
  height: 88rpx;
  line-height: 88rpx;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(151, 151, 151, 0.1);
  position: absolute;
  bottom: 0;
}

.modalDlg3 .t {
  margin-top: 24rpx;
  height: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: rgba(36, 36, 36, 1);
  line-height: 40rpx;
}

.modalDlg3 .submit {
  color: rgba(255, 221, 5, 1);
}

.modalDlg3 .note {
  height: 34rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: rgba(36, 36, 36, 0.4);
  line-height: 34rpx;
  margin-top: 12rpx;
  margin-bottom: 16rpx;
}

/* 留言 */
.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  padding: 24rpx;
  z-index: 99;
}

.toliuyan {
  background: #f5f5f5;
  border-radius: 22px;
  padding: 14rpx 36rpx;
  color: rgba(36, 36, 36, 0.4);
  text-align: left;
}

.liuyan {
  background: #ffffff;
  border-radius: 8px;
  font-size: 28rpx;
  margin-bottom: 120rpx;
  padding: 32rpx;
  text-align: left;
}

.liulist {
  margin-top: 50rpx;
}

.liulist image {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.liulist_title {
  color: rgba(36, 36, 36, 0.6);
}

.liulist_time {
  color: rgba(36, 36, 36, 0.4);
  font-size: 22rpx;
}

/* 留言 */
.writeReply {
  padding: 24rpx;
}

.writeReply > view:nth-of-type(1) {
  background: #f0f1f2;
  border-radius: 8px;
  padding: 24rpx;
}

.writeReply > view:nth-of-type(2) {
  text-align: right;
  margin-top: 18rpx;
}

.writeReply > view:nth-of-type(2) text {
  display: inline-block;
  width: 150rpx;
  height: 56rpx;
  background: #0091ff;
  border-radius: 14px;
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  line-height: 56rpx;
}

/* 弹窗回复详情 */
.reply {
  /* max-height: 1000rpx; */
  /* overflow-y: scroll; */
  text-align: left;
}

.scrollY {
  height: calc(80vh - 264rpx);
  /* padding-bottom: 150rpx; */
}

.close {
  color: rgba(36, 36, 36, 0.4);
  font-size: 28rpx;
  font-weight: normal;
  position: absolute;
  top: 36rpx;
  left: 24rpx;
}

.reply > view:nth-of-type(1) {
  padding: 36rpx 12rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: #ffffff;
}
</style>
