<template>
  <view class="all" v-if="alldata != ''">
    <!-- 订单状态 -->
    <view
      class="orderS"
      :style="alldata.task_state == 3 ? 'background: #D4D3D3;' : ''"
    >
      <view>任务状态</view>
      <view style="display: flex; align-items: center; font-size: 40rpx">
        <u-icon
          name="clock"
          size="40rpx"
          style="margin: 2rpx 6rpx 0 0"
          v-if="
            alldata.task_state == 0 ||
            alldata.task_state == 1 ||
            alldata.task_state == 2
          "
        ></u-icon>
        <u-icon
          name="checkmark-circle"
          size="40rpx"
          style="margin: 2rpx 6rpx 0 0"
          v-if="alldata.task_state == 4"
        ></u-icon>
        <u-icon
          name="info-circle"
          size="40rpx"
          style="margin: 2rpx 6rpx 0 0"
          v-if="alldata.task_state == 3"
        ></u-icon>
        {{
          alldata.task_state == 0 && alldata.is_pay == 1
            ? "待接单"
            : alldata.task_state == 0 && alldata.is_pay == 0
            ? "待支付"
            : alldata.task_state == 1 && alldata.static_cancel.code == 1
            ? "进行中"
            : alldata.task_state == 2
            ? "待结算"
            : alldata.task_state == 3 && alldata.static_cancel.code == 1
            ? "已取消"
            : (alldata.task_state == 3 && alldata.static_cancel.code == 0) ||
              (alldata.task_state == 1 && alldata.static_cancel.code == 0)
            ? "任务取消中"
            : alldata.task_state == 4
            ? "已完成"
            : ""
        }}
      </view>
      <view v-if="alldata.destination_time.down != ''">
        <u-count-down
          :timestamp="alldata.destination_time.down"
          bg-color="transparent"
          v-if="
            alldata.task_state == 1 &&
            alldata.destination_time.down != '已超时' &&
            alldata.static_cancel.code == 1
          "
        ></u-count-down>
        <text
          style="color: #ff3939"
          v-if="
            alldata.task_state == 1 &&
            alldata.destination_time.down == '已超时' &&
            alldata.static_cancel.code == 1
          "
          >已超时</text
        >
      </view>
    </view>
    <!-- 取消警告 -->
    <view
      v-if="
        (alldata.task_state == 3 && alldata.static_cancel.code == 0) ||
        (alldata.task_state == 1 && alldata.static_cancel.code == 0)
      "
      style="
        font-size: 24rpx;
        color: #fc463c;
        text-align: center;
        margin-bottom: 30rpx;
      "
      >任务已取消，双方确认取消后订单作废</view
    >
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
              <view class="name"> {{ alldata.user_name }} </view>
              <image
                class="gender"
                v-if="alldata.user_info.sex.code != 0"
                :src="
                  alldata.user_info.sex.code == 1
                    ? '/static/index/man.png'
                    : '/static/index/female.png'
                "
              ></image>
              <!-- <image class="gender" v-if="alldata.user_info.is_store.code == 1" src="/static/mine/shop.png"></image> -->
              <view>
                <text class="xinyu">信誉{{ alldata.user_info.credit }}</text>
              </view>
            </view>
            <view class="user-t">
              <view class="time">{{ alldata.create_time }}</view>
              <!-- <view class="location">郑州大学</view> -->
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
      商品预付金额，先由接单者垫付商品金额完成任务后直接到账余额没有任何手续费，若垫付金额与实际金额有差额请及时与接单者沟通
    </view>
    <!-- 02 快递信息 -->
    <view class="center">
      <view class="c-per">
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
              <view class="c-per-t pickInfo">
                <view class="pickInfo-t">取件信息</view>
                <view class="pickInfo-c">{{ item.express_desc }}</view>
              </view>
            </view>
          </view>
          <!-- 跑腿 -->
          <view
            style="border-bottom: 1px solid #f2f2f2"
            v-if="alldata.type == 2"
          >
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
          <view class="deliveryPlace" v-if="alldata.type != 3">
            <view class="cp-t">备注：</view>
            <view class="cp-c notes-c">{{ alldata.comment }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 我已完成 -->
    <view
      class="compelete"
      v-if="alldata.task_state != 0 && alldata.task_state != 4"
    >
      <view
        @click="call"
        class="call"
        v-if="
          (alldata.task_state == 1 && alldata.static_cancel.code == 1) ||
          alldata.task_state == 2 ||
          (alldata.task_state == 3 && alldata.static_cancel.code == 0)
        "
      >
        <u-icon name="phone-fill" size="40rpx"></u-icon>
      </view>
      <view
        class="btnall"
        @click="haveCompleted1"
        v-if="
          alldata.task_state == 1 &&
          alldata.static_cancel.code == 0 &&
          alldata.static_cancel.cancel_code == 1
        "
        style="background: #ffebab; width: 268rpx; margin-right: 50rpx"
        >拒绝</view
      >
      <view
        class="btnall"
        @click="haveCompleted"
        v-if="
          alldata.task_state == 1 ||
          alldata.task_state == 2 ||
          alldata.task_state == 3
        "
        :style="
          alldata.task_state == 1 && alldata.static_cancel.code == 1
            ? 'background: #C8C8C8;'
            : alldata.task_state == 1 &&
              alldata.static_cancel.code == 0 &&
              alldata.static_cancel.cancel_code == 1
            ? 'width:268rpx'
            : ''
        "
        >{{
          alldata.task_state == 1 && alldata.static_cancel.code == 1
            ? "结算"
            : alldata.task_state == 2
            ? "确认收货"
            : alldata.task_state == 1 &&
              alldata.static_cancel.code == 0 &&
              alldata.static_cancel.cancel_code == 1
            ? "同意取消"
            : alldata.task_state == 3 && alldata.static_cancel.code == 1
            ? "重新发布"
            : alldata.task_state == 3 &&
              alldata.static_cancel.code == 0 &&
              alldata.static_cancel.cancel_code == 2
            ? "撤销“取消订单"
            : ""
        }}</view
      >
    </view>
    <view
      class="compelete"
      v-if="alldata.task_state == 0 && alldata.is_pay == 0"
    >
      <view class="btnall" @click="goOrder">去支付</view>
    </view>
    <!-- 留言 -->
    <view class="liuyan">
      <view style="margin-bottom: 24rpx">全部留言（{{ allLiu }}）</view>
      <view class="liulist">
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
      </view>
      <u-loadmore
        :status="status"
        :icon-type="iconType"
        :load-text="loadText"
      />
    </view>
    <!-- 底部固定 -->
    <view class="foot">
      <view class="toliuyan" @click="showWrite()"> 我要留言…… </view>
    </view>
    <!-- 留言弹窗 -->
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
              @on-success="onSuccess"
              ref="uUpload"
              :auto-upload="true"
				:before-upload="beforeUpload"
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
          回复详情</view
        >
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
    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import {
  getInfoTask,
  listComment,
  insertComment,
  delComment,
  Praise,
  Inform,
  taskUpdateState,
  refuseCancel,
  delTask,
  taskCancel,
  taskComplete,
  getInfoSystem,
  taskCancelIsTime,
} from "../../../../services/function.js";
import { delImages } from "../../../../services/community.js";
import LeaveMess from "@/components/perFunctionInfo/leaveMess/leaveMess.vue";
import LeaveMess1 from "@/components/perFunctionInfo/leaveMess1/leaveMess.vue";
import helangCompress from "@/components/helang-compress/helang-compress";
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
      rate5: "",
	  qutime:"",
      allrate: "",
      task_id: "",
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
      navTop: getApp().globalData.navTop,
      navHeight: getApp().globalData.navHeight,
      showliuyan: false,
      showModal: false,
      showReply: false,
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
    goOrder() {
      // 消息提醒 新的评论回复 、新的评论提醒、服务进度
      uni.requestSubscribeMessage({
        tmplIds: [
          "Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y",
          "mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps",
          "VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI",
        ],
        complete: (res) => {
          // 不管成功失败都执行添加任务
          uni.navigateTo({
            url: "/pages/addIssue/issueOrder/issueOrder?id=" + this.alldata.id,
          });
        },
      });
    },
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
    toMinePage(id) {
      uni.navigateTo({
        url: "/pages/community/minePage/minePage?id=" + id,
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
            console.log(this.huiList, index);
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
    // 图
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
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        uni.hideLoading();
        if (res.code == 200) {
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
                    if (res.code == 200) {
                      that.page = 1;
                      that.liuList = [];
                      that.status = "loading";
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
          //   console.log(res.tapIndex, id);
        },
        fail(res) {
          console.log(res.errMsg);
        },
      });
    },
    // 任务
    moreBtn() {
      let that = this;
      // 已取消 已完成可删除
      if (
        (this.alldata.task_state == 3 &&
          this.alldata.static_cancel.code == 1) ||
        this.alldata.task_state == 4 ||
        (this.alldata.task_state == 0 && this.alldata.is_pay == 0)
      ) {
        uni.showActionSheet({
          itemList: ["删除订单"],
          itemColor: "#ff0000",
          success(res) {
            uni.showModal({
              title: "提示",
              content: "确定要删除该订单吗",
              success(res) {
                if (res.confirm) {
                  delTask({
                    id: that.alldata.id,
                  }).then((res) => {
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
                  // console.log("用户点击确定");
                } else if (res.cancel) {
                  // console.log("用户点击取消");
                }
              },
            });
          },
          fail(res) {
            console.log(res.errMsg);
          },
        });
      } else if (this.alldata.task_state == 0 && this.alldata.is_pay == 1) {
        uni.showActionSheet({
          itemList: ["取消订单"],
          itemColor: "#ff0000",
          success: (res) => {
            // 判断是否在二十分钟内
            taskCancelIsTime({
              id: that.alldata.id,
            }).then((res) => {
              if (res.code == 200) {
                if (res.result.cancel_is_time == 1) {
                  // 二十分钟后直接取消订单
                  uni.showModal({
                    cancelText: "返回",
                    title: "温馨提示",
                    content:
                      "您发布的任务不超过"+that.qutime+"，将收取" +
                      that.rate5 +
                      "%手续费,确定取消吗",
                    success: (res) => {
                      if (res.confirm) {
                        taskUpdateState({
                          task_id: that.alldata.id,
                          task_state: 3,
                        }).then((res) => {
                          uni.showToast({
                            title: res.message,
                            icon: "none",
                          });
                          if (res.code == 200) {
                            getInfoTask({
                              id: that.task_id,
                            }).then((res) => {
                              if (res.code == 200) {
                                that.alldata = res.result;
                              }
                            });
                          }
                        });
                        // console.log("用户点击确定");
                      } else if (res.cancel) {
                        // console.log("用户点击取消");
                      }
                    },
                  });
                }
                // 五分钟内直接取消订单需要手续费0.8%
                else {
                  // 五分钟后直接取消订单
                  uni.showModal({
                    cancelText: "返回",
                    title: "温馨提示",
                    content: "您确定要取消该任务吗",
                    success(res) {
                      if (res.confirm) {
                        taskUpdateState({
                          task_id: that.alldata.id,
                          task_state: 3,
                        }).then((res) => {
                          uni.showToast({
                            title: res.message,
                            icon: "none",
                          });
                          if (res.code == 200) {
                            getInfoTask({
                              id: that.task_id,
                            }).then((res) => {
                              if (res.code == 200) {
                                that.alldata = res.result;
                              }
                            });
                          }
                        });
                        // console.log("用户点击确定");
                      } else if (res.cancel) {
                        // console.log("用户点击取消");
                      }
                    },
                  });
                }
              }
            });
          },
          fail(res) {
            console.log(res.errMsg);
          },
        });
      }
      // 进行中取消
      else if (this.alldata.task_state == 1) {
        uni.showActionSheet({
          itemList: ["取消订单"],
          itemColor: "#ff0000",
          success(res) {
            uni.showModal({
              cancelText: "继续任务",
              title: "温馨提示",
              content:
                "您的任务已被接单，如果取消将扣除金额的" +
                that.allrate +
                "%作为补偿，您确定取消吗？",
              success(res) {
                if (res.confirm) {
                  uni.showLoading({
                    title: "提交中……",
                    mask: true,
                  });
                  taskUpdateState({
                    task_id: that.alldata.id,
                    task_state: 3,
                  }).then((res) => {
                    uni.hideLoading();
                    uni.showToast({
                      title: res.message,
                      icon: "none",
                    });
                    if (res.code == 200) {
                      getInfoTask({
                        id: that.task_id,
                      }).then((res) => {
                        if (res.code == 200) {
                          that.alldata = res.result;
                        }
                      });
                    }
                  });
                  // console.log("用户点击确定");
                } else if (res.cancel) {
                  // console.log("用户点击取消");
                }
              },
            });
            //   console.log(res.tapIndex);
          },
          fail(res) {
            console.log(res.errMsg);
          },
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
    call() {
      uni.makePhoneCall({
        phoneNumber: this.alldata.TaskOrder.PickUser.phone,
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
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
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
          uni.hideLoading();
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
          uni.hideLoading();
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
    getTask() {
      getInfoTask({
        id: this.task_id,
      }).then((res) => {
        uni.hideLoading();
        if (res.code == 200) {
          this.alldata = res.result;
          this.getList();

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
    // 改变任务状态
    haveCompleted() {
      let task_state = "";
      // 确认收货
      if (this.alldata.task_state == 2) {
        task_state = 4;
      }
      // 发布人同意取消订单
      else if (
        this.alldata.task_state == 1 &&
        this.alldata.static_cancel.code == 0
      ) {
        uni.showLoading({
          title: "提交中……",
          mask: true,
        });
        task_state = 3;
        taskCancel({
          task_id: this.alldata.id,
          task_state: task_state,
        }).then((res) => {
          uni.hideLoading();
          uni.showToast({
            title: res.message,
            icon: "none",
          });
          if (res.code == 200) {
            this.getTask();
          }
        });
        return false;
      }
      // 撤销取消任务
      else if (
        this.alldata.task_state == 3 &&
        this.alldata.static_cancel.code == 0
      ) {
        task_state = 1;
      }
      // 重新发布
      else if (
        this.alldata.task_state == 3 &&
        this.alldata.static_cancel.code == 1
      ) {
        // 消息提醒 新的评论回复 、新的评论提醒、服务进度
        uni.requestSubscribeMessage({
          tmplIds: [
            "Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y",
            "mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps",
            "VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI",
          ],
          complete: (res) => {
            if (this.alldata.type == 3) {
              uni.navigateTo({
                url:
                  "/pages/addIssue/otherIssue/otherIssue?issueType=2&id=" +
                  this.alldata.id,
              });
            } else if (this.alldata.type == 1) {
              uni.navigateTo({
                url:
                  "/pages/addIssue/expressageIssue/expressageIssue?id=" +
                  this.alldata.id,
              });
            } else if (this.alldata.type == 2) {
              uni.navigateTo({
                url:
                  "/pages/addIssue/otherIssue/otherIssue?issueType=1&id=" +
                  this.alldata.id,
              });
            }
          },
        });
        return false;
      } else {
        return false;
      }
      uni.showModal({
        title: "提示",
        content: "确定执行该操作吗？",
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "提交中……",
              mask: true,
            });
            taskUpdateState({
              task_id: this.alldata.id,
              task_state: task_state,
            }).then((res) => {
              uni.hideLoading();
              uni.showToast({
                title: res.message,
                icon: "none",
              });
              if (res.code == 200) {
                this.getTask();
                // 确认收货跳转页面
                if (task_state == 4) {
                  setTimeout(() => {
                    uni.navigateTo({
                      url:
                        "/pages/mine/taskOver/taskOver?id=" + this.alldata.id,
                    });
                  }, 1500);
                }
              }
            });
          } else if (res.cancel) {
            // console.log('用户点击取消');
          }
        },
      });
    },
    // 拒绝
    haveCompleted1() {
      uni.showModal({
        title: "提示",
        content: "确定执行该操作吗？",
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "提交中……",
              mask: true,
            });
            refuseCancel({
              task_id: this.alldata.id,
            }).then((res) => {
              uni.hideLoading();
              uni.showToast({
                title: res.message,
                icon: "none",
              });
              this.getTask();
            });
          } else if (res.cancel) {
            // console.log('用户点击取消');
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
    this.task_id = options.id;
    this.getTask();
    // 接单获取扣的百分比
    taskComplete({
      common: "发布人取消百分比",
    }).then((res) => {
      if (res.code == 200) {
        this.allrate = res.result[0] + res.result[1];
      }
    });
	getInfoSystem({
	  key: "发布人取消任务时间",
	}).then((res) => {
	  if (res.code == 200) {
	    this.qutime = this.$Numcheck.rounding(res.result.value/60,0)+"分钟";
	  }
	});
    // 未接单 多少分钟内取消 百分比
    getInfoSystem({
      key: "发布人取消订单平台扣除发布金额百分比",
    }).then((res) => {
      if (res.code == 200) {
        this.rate5 = res.result.value;
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
  margin: 0 auto;
}

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
  background: rgba(255, 255, 255, 1);
  border-radius: 10rpx;
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
  height: auto;
  width: 100%;
}

.c-per {
  width: 100%;
  margin-bottom: 40rpx;
}

.pickInfo {
  width: 100%;
  height: 190rpx;
  background: #fef8e5;
  border-radius: 8px;
  padding: 24rpx 38rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.pickInfo-t {
  font-size: 24rpx;
}

.pickInfo-c {
  font-size: 32rpx;
  font-weight: 400;
  margin-top: 20rpx;
}

.center-per {
  margin-bottom: 40rpx;
  width: 686rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 32rpx;
  box-sizing: border-box;
  color: rgba(36, 36, 36, 0.4);
  font-size: 20rpx;
  text-align: left;
  padding-left: 68rpx;
  margin-bottom: 32rpx;
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

/* 03 发布人信息 */

.issuerInfo {
  width: 100%;
  height: 210rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 32rpx;
  box-sizing: border-box;
  text-align: left;
  position: relative;
  margin-bottom: 286rpx;
}

.issuerInfo-t {
  width: 100%;
  height: 28rpx;
  font-size: 20rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(36, 36, 36, 0.6);
  line-height: 28rpx;
}

.issuerName,
.issuerTel {
  width: 100%;
  height: 60rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 400;
  color: rgba(36, 36, 36, 1);
  line-height: 60rpx;
  margin: 6rpx 0;
}

.call {
  width: 96rpx;
  height: 96rpx;
  background: #fec200;
  border-radius: 50%;
  margin-right: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 我已完成 */

.compelete {
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btnall {
  width: 402rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #fec200;
  border-radius: 48rpx;
  font-weight: bold;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
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
</style>
