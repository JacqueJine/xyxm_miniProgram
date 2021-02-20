import Vue from 'vue'
import App from './App'

import uView from "uview-ui";
Vue.use(uView);
//引入vuex
import store from './store'
import check from './utils/common/check'
import Numcheck from './utils/common/number'
// 全局share
import share from './utils/common/share.js'

Vue.mixin(share)
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$check = check
Vue.prototype.$Numcheck = Numcheck
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
	check,
	Numcheck
})
app.$mount()
