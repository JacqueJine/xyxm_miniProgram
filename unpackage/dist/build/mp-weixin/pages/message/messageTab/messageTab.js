(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/message/messageTab/messageTab"],{"4ede":function(e,t,s){"use strict";s.r(t);var a=s("71a4"),n=s.n(a);for(var i in a)"default"!==i&&function(e){s.d(t,e,(function(){return a[e]}))}(i);t["default"]=n.a},"71a4":function(e,t,s){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=s("0b6e"),n={data:function(){return{imgBaseUrl:getApp().globalData.imgBaseUrl,offset:[0,10],tab:1,options:[{text:"删除",style:{backgroundColor:"#dd524d"}}],popShow:!1,popList:[{text:"删除"}],page:1,status:"loading",iconType:"flower",loadText:{loadmore:"轻轻上拉",loading:"努力加载中",nomore:"实在没有了"},list:[],message_type:[]}},onLoad:function(t){e.getStorageSync("token")?(this.tab=t.type,e.setNavigationBarTitle({title:t.type}),this.message_type=JSON.parse(t.types),this.getMess()):this.status="nomore"},onReachBottom:function(){if("nomore"==this.status)return!1;this.getMess()},methods:{delitem:function(t){var s=this;e.showActionSheet({itemList:["删除"],success:function(e){s.del(t)}})},delMess:function(t){var s=this;e.showModal({title:"提示",content:"确定要删除吗？",success:function(e){e.confirm&&s.del(t)}})},del:function(t){var s=this;(0,a.deleteMessage)({id:t}).then((function(t){200==t.code?(s.list=[],s.page=1,s.status="loading",s.getMess()):e.showToast({title:t.message,icon:"none"})}))},getMess:function(){var e=this;(0,a.getUnread)({where:{message_type:this.message_type},limit:10,page:this.page}).then((function(t){200==t.code?(e.page++,e.list=e.list.concat(t.result.list),(t.result.count<=10||!t.result.list.length)&&(e.status="nomore")):e.status="nomore"}))},toDetail:function(t,s,n,i){var o=this;"点赞"==this.tab?e.requestSubscribeMessage({tmplIds:["CgI2RUfrhhaM0eKIykkjG80cxBGaw7gqwg7ulv8qBOs","loosDS_rJeap9JOHwFnPOpjoNp3LPCkBuG68advTU_g"],complete:function(u){if((0,a.readMessage)({id:n}).then((function(e){200==e.code&&(o.list[i].status=1)})),null==t||""==t)return e.showToast({title:"内容已被删除",icon:"none"}),!1;var r="";2==parseInt(s/10)?(r=t.posts_id?t.posts_id:t.id,e.navigateTo({url:"/pages/community/commDetail/commDetail?id="+r})):1==parseInt(s/10)?e.navigateTo({url:"/pages/task/taskList/taskDetail/taskDetail?id="+t.task_id}):(3==parseInt(s/10)||6==parseInt(s/10))&&e.navigateTo({url:"/pages/message/messageDetail/messageDetail?id="+n})}}):"系统"==this.tab?e.requestSubscribeMessage({tmplIds:["Fui72A7YyTUy46w9jLHONqsZYV-Ssjionl0QvVOQeu0"],complete:function(u){if((0,a.readMessage)({id:n}).then((function(e){200==e.code&&(o.list[i].status=1)})),null==t||""==t)return e.showToast({title:"内容已被删除",icon:"none"}),!1;var r="";2==parseInt(s/10)?(r=t.posts_id?t.posts_id:t.id,e.navigateTo({url:"/pages/community/commDetail/commDetail?id="+r})):1==parseInt(s/10)?e.navigateTo({url:"/pages/task/taskList/taskDetail/taskDetail?id="+t.task_id}):(3==parseInt(s/10)||6==parseInt(s/10))&&e.navigateTo({url:"/pages/message/messageDetail/messageDetail?id="+n})}}):e.requestSubscribeMessage({tmplIds:["Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y","mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps"],complete:function(u){if((0,a.readMessage)({id:n}).then((function(e){200==e.code&&(o.list[i].status=1)})),null==t||""==t)return e.showToast({title:"内容已被删除",icon:"none"}),!1;var r="";2==parseInt(s/10)?(r=t.posts_id?t.posts_id:t.id,e.navigateTo({url:"/pages/community/commDetail/commDetail?id="+r})):1==parseInt(s/10)?e.navigateTo({url:"/pages/task/taskList/taskDetail/taskDetail?id="+t.task_id}):(3==parseInt(s/10)||6==parseInt(s/10))&&e.navigateTo({url:"/pages/message/messageDetail/messageDetail?id="+n})}})}}};t.default=n}).call(this,s("543d")["default"])},"7e10":function(e,t,s){},"85bb":function(e,t,s){"use strict";s.r(t);var a=s("a66a"),n=s("4ede");for(var i in n)"default"!==i&&function(e){s.d(t,e,(function(){return n[e]}))}(i);s("aef0");var o,u=s("f0c5"),r=Object(u["a"])(n["default"],a["b"],a["c"],!1,null,"08b39df0",null,!1,a["a"],o);t["default"]=r.exports},a66a:function(e,t,s){"use strict";s.d(t,"b",(function(){return n})),s.d(t,"c",(function(){return i})),s.d(t,"a",(function(){return a}));var a={uBadge:function(){return s.e("node-modules/uview-ui/components/u-badge/u-badge").then(s.bind(null,"3d95"))},uTag:function(){return s.e("node-modules/uview-ui/components/u-tag/u-tag").then(s.bind(null,"8a2b"))},uSwipeAction:function(){return s.e("node-modules/uview-ui/components/u-swipe-action/u-swipe-action").then(s.bind(null,"3966"))},uLoadmore:function(){return s.e("node-modules/uview-ui/components/u-loadmore/u-loadmore").then(s.bind(null,"811d"))}},n=function(){var e=this,t=e.$createElement,s=(e._self._c,"系统"!=e.tab?e.__map(e.list,(function(t,s){var a=e.__get_orig(t),n=e.$u.timeFrom(t.int_create_time,!1);return{$orig:a,g0:n}})):null),a="系统"==e.tab?e.__map(e.list,(function(t,s){var a=e.__get_orig(t),n=parseInt(t.message_type/10),i=parseInt(t.message_type/10),o=parseInt(t.message_type/10),u=e.$u.timeFrom(t.int_create_time,!1);return{$orig:a,m0:n,m1:i,m2:o,g1:u}})):null;e.$mp.data=Object.assign({},{$root:{l0:s,l1:a}})},i=[]},aef0:function(e,t,s){"use strict";var a=s("7e10"),n=s.n(a);n.a},f15d:function(e,t,s){"use strict";(function(e){s("394a");a(s("66fd"));var t=a(s("85bb"));function a(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,s("543d")["createPage"])}},[["f15d","common/runtime","common/vendor"]]]);