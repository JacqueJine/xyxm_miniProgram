// 总
const baseUrl = getApp().globalData.imgBaseUrl;

const request = (url = '', method = 'POST', data = {}) => {

	return new Promise((resolve, reject) => {
		uni.request({
			method: 'post',
			url: baseUrl + url,
			data: data,
			header: {
				//  'content-type' : 'application/x-www-form-urlencoded'
				'content-type': 'application/json',
				'token': uni.getStorageSync('token'),
			},
			dataType: 'json'
		}).then((response) => {
			let [error, res] = response;
			// 登录过期
			if (res.data.code == 401 || res.data.code == 422) {
				uni.showModal({
					title: '警告',
					content: '您未登录,请授权登录!',
					showCancel: false,
					success: function(res1) {
						if (res1.confirm) {
							uni.reLaunch({
								url: "/pages/Tab/login/login"
							});
							uni.clearStorage();
							uni.setStorageSync('Login', false);
						}
					}
				});
			}

			resolve(res.data);
		}).catch((error) => {
			let [err, res] = error;
			reject(err);
		});
	});
}

export default request
