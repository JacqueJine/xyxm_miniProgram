<script>
export default {
  onLaunch: function () {
    wx.cloud.init({
      env: "xyxm-2qm1g",
      traceUser: true,
    });
    // 胶囊信息单位px
    let menuButtonObject = uni.getMenuButtonBoundingClientRect(),
      navTop = menuButtonObject.top; //胶囊按钮与顶部的距离
    // navHeight = menuButtonObject.height; //胶囊高度
    this.globalData.navTop = navTop;

    // 设备信息
    uni.getSystemInfo({
      success: (res) => {
        this.globalData.windowHeight = res.windowHeight;
        let navHeight =
          res.statusBarHeight +
          menuButtonObject.height +
          (menuButtonObject.top - res.statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
      },
      fail(err) {
        console.log(1, err);
      },
    });
    // 设置登录状态
    if (uni.getStorageSync("token")) {
      uni.setStorageSync("Login", true);
    } else {
      uni.setStorageSync("Login", false);
    }
    // 自动根据版本切换接口请求地址
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync();
    console.log(envVersion);
    switch (envVersion) {
      default:
        //默认正式版
        this.globalData.imgBaseUrl = `https://xyxm.mingshifan.com`;
        break;
      case "release": //正式版
        this.globalData.imgBaseUrl = `https://xyxm.mingshifan.com`;
        break;
      case "trial": //体验版
        this.globalData.imgBaseUrl = `https://xyxm.mingshifan.cn`;
        break;
      case "develop": //开发版
        this.globalData.imgBaseUrl = `https://xyxm.mingshifan.cn`;
        // this.globalData.imgBaseUrl = `http://192.168.31.37`;
        // this.globalData.imgBaseUrl = `http://192.168.31.25`;
        break;
    }
    // #ifdef MP
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    });
    updateManager.onUpdateReady(function (res) {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(function (res) {
      // 新的版本下载失败
    });
    // #endif
    uni.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        uni.showModal({
          title: "网络失去链接",
          content: "请检查网络链接",
          showCancel: false,
        });
      }
    });
  },
  onShow() {
    // console.log('App Show');
    // console.log(this.$store)
    // this.$store.dispatch('wsConnect','ws://192.168.31.37:8000')
    // if (uni.getStorageSync('token')) {
    // 	// 创立链接
    // 	uni.connectSocket({
    // 		url: 'ws://192.168.31.37:2346'
    // 	});
    // 	// 连接成功
    // 	uni.onSocketOpen(res => {
    // 		console.log('WebSocket连接已打开！');
    // 		// 在连接成功的回调中才能给服务器发消息
    // 		uni.sendSocketMessage({
    // 			data: uni.getStorageSync('token'),
    // 			fail: (err) => {
    // 				// 未连接打开websocket连接
    // 				console.log('发送消息失败：' + err);
    // 			}
    // 		});
    // 	});
    // 	// 接收到服务器的内容
    // 	uni.onSocketMessage(res => {
    // 		console.log('收到服务器内容：' + res.data);
    // 	});
    // 	// 连接失败
    // 	uni.onSocketError(res => {
    // 		console.log('WebSocket连接打开失败，请检查！', res);
    // 	});
    // }
  },
  globalData: {
    navTop: "",
    navHeight: "",
    windowHeight: "",
    uid: 3,
    imgBaseUrl: "",
  },
};
</script>

<!-- // App.vue文件  中首行的位置引入，注意给style标签加入lang="scss"属性 -->
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

button::after {
  border: none;
}

view {
  word-break: break-all; //属性规定自动换行的处理方法。允许在单词内换行。
  white-space: pre-wrap;
}
</style>
