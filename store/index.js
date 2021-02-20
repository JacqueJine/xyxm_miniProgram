import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {},
	mutations: {},
	actions: {
		wsConnect({ commit },
			url
		) {
			return new Promise((resolve, reject) => {
				uni.connectSocket({
					url: url
				});
				uni.onSocketOpen(res => {
					console.log('WS连接已打开！');
					resolve('data')
				});
				uni.onSocketError(res => {
					console.log('WS连接打开失败，请检查！');
					reject('err')
				});
			})

		}
	}
})
export default store
