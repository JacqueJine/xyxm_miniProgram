<template>
  <view class="main">
    <view class="input">
      <textarea
        style="width: 100%; height: 780rpx"
        v-model="info.introduce"
        maxlength="200"
        placeholder="请输入商品介绍，不超过200个字"
      />
      <u-upload
        :action="action"
					:size-type="['compressed']"
        max-count="10"
        :file-list="fileList"
        @on-remove="onRemove"
        :show-tips="false"
        @on-success="onSuccess"
        ref="uUpload"
        :auto-upload="true"
					:before-upload="beforeUpload"
      ></u-upload>
    </view>
    <view class="saveBtn" @click="toPage"> 保存 </view>
    <helang-compress ref="helangCompress"></helang-compress>
  </view>
</template>

<script>
import { delImages } from "../../../../../services/community.js";
import helangCompress from "@/components/helang-compress/helang-compress";
export default {
  components: {
    helangCompress,
  },
  data() {
    return {
      info: {
        introduce: "",
        picture: [],
      },
      fileList: [],
      action: getApp().globalData.imgBaseUrl + "/common/upload/image.html",
    };
  },
  methods: {
    toPage() {
      uni.setStorage({
        key: "goodsInfo",
        data: JSON.stringify(this.info),
      });
      uni.navigateBack();
    },
    // 图
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
        this.info.picture.push(data.result.src);
      } else {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
    },
    onRemove(index, lists) {
      delImages({
        path: this.info.picture[index],
      }).then((res) => {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
        if (res.code == 200) {
          this.info.picture.splice(index, 1);
        }
      });
    },
  },
  onLoad() {
    let that = this;
    uni.getStorage({
      key: "goodsInfo",
      success(res) {
        let options = JSON.parse(res.data);
        that.info = options;
        if (options.picture == null) {
          that.info.picture = [];
        }
        for (let i in options.picture) {
          that.fileList.push({
            url: getApp().globalData.imgBaseUrl + options.picture[i],
          });
        }
      },
    });
  },
};
</script>

<style scoped>
.main {
  padding: 50rpx 24rpx 112rpx;
}

.input {
  width: 100%;
  min-height: 980rpx;
  box-sizing: border-box;
  padding: 24rpx;
  background: #f9f9f9;
}

.saveBtn {
  width: 100%;
  height: 98rpx;
  line-height: 98rpx;
  background: #fec200;
  border-radius: 4rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  text-align: center;
  font-size: 36rpx;
  color: #333333;
}
</style>
