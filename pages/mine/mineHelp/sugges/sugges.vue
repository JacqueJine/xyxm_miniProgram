<template>
  <view class="content">
    <view>
      <textarea
        v-model="forminfo.text"
        maxlength="200"
        placeholder="请输入反馈或建议，不超过200个字"
      />
    </view>
    <view>
      <view>上传图片</view>
      <view>
        <u-upload
          :action="action"
					:size-type="['compressed']"
          max-count="9"
          :file-list="fileList"
          @on-remove="onRemove"
          @on-success="onSuccess"
          :show-tips="false"
        ></u-upload>
      </view>
    </view>
    <view @click="submit">提交</view>
  </view>
</template>

<script>
import { delImages } from "../../../../services/community.js";
import { addTickling } from "../../../../services/mine.js";
export default {
  data() {
    return {
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
      forminfo: {
        text: "",
        img: [],
      },
    };
  },
  methods: {
    onSuccess(data, index, lists, name) {
      if (data.code == 200) {
        this.forminfo.img.push(data.result.src);
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    submit() {
      if (this.forminfo.text == "" && this.forminfo.img.length < 1) {
        uni.showToast({
          title: "文字和图片至少选择一种",
          icon: "none",
        });
        return false;
      }
      // 消息提醒 :反馈处理结果通知
      uni.requestSubscribeMessage({
        tmplIds: ["HxlB6iilBr3U7sVnQzKmdop3tWnHdEtX-KD9rjKPxlQ"],
        complete: (res) => {
          // 不管成功失败都执行添加任务
          uni.showLoading({
            title: "提交中……",
            mask: true,
          });
          addTickling({
            data: this.forminfo,
          }).then((res) => {
            uni.hideLoading();
            uni.showToast({
              title: res.message,
              icon: "none",
            });
            if (res.code == 200) {
              setTimeout(() => {
                uni.navigateBack();
              }, 2000);
            }
          });
        },
      });
    },
    onRemove(index, lists) {
      delImages({
        path: this.forminfo.img[index],
      }).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.forminfo.img.splice(index, 1);
        }
      });
    },
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

.content > view:nth-of-type(2) > view:nth-of-type(1) {
  color: rgba(24, 19, 0, 0.4);
  margin-bottom: 20rpx;
}

.content > view:nth-of-type(3) {
  line-height: 88rpx;
  text-align: center;
  background: #fec200;
  border-radius: 22px;
  margin-top: 90rpx;
}
</style>
