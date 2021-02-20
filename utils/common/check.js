function checkTxt(text) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '检测中...',
			mask: true
		});
		wx.cloud.callFunction({
			name: 'Check',
			data: {
				txt: text
			},
			success: (res) => {
				uni.hideLoading();
				if (res.result.errCode == 87014) {
					wx.showToast({
						title: '文字内容存在违规,请谨慎书写',
						icon: 'none'
					});
					reject();
				} else {
					resolve(true);
				}
			},
			fail(e) {
				uni.hideLoading();
				wx.showToast({
					title: '好像出错了，请重试',
					icon: 'none'
				});
			}
		});
	});
};

function checkImg1(index, path, lists) {
	return new Promise((resolve, reject) => {
		let encode = ''
		let buffer = uni.getFileSystemManager().readFileSync(path, encode);
		imgSecCheck({
				contentType: 'image/jpeg',
				buffer: buffer,
				encode: encode
			}).then(res => {
				resolve(true)
			})
			.catch(err => {
				wx.showToast({
					title: '图片违规',
					icon: 'none'
				});
				lists.splice(index, 1);
				reject(false)
			})
	})
}

function imgSecCheck(media) {
	return new Promise((resolve, reject) => {
		wx.cloud.callFunction({
			name: 'imgCheck',
			data: {
				media: media
			},
			complete: ress => { //异步结果
				if (ress.result.code != 200) { //内容不正常
					// resolve(false)
					reject(false)
				} else {
					resolve(true)
				}
			}
		})
	})
}

function checkImg(index, path, lists) {
	// uni.showLoading({
	//     title: '检测中...',
	//     mask: true
	// });
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: path,
			success: buffer => {
				wx.cloud.callFunction({
					name: 'Check',
					data: {
						value: buffer.data
					},
					success(res) {
						if (res.result.errCode == 87014) {
							wx.showToast({
								title: '图片违规',
								icon: 'none'
							});
							lists.splice(index, 1);
							reject(false);
						} else {
							resolve(true);
						}
					},
					fail(e) {
						wx.showToast({
							title: '好像出错了，请重试',
							icon: 'none'
						});
						lists.splice(index, 1);
						reject(false);
					}
				});
			}
		});
	});
};
module.exports = {
	checkImg,
	checkTxt,
	checkImg1
}
