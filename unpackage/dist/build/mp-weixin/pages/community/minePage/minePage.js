(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/community/minePage/minePage"],{2129:function(t,e,i){"use strict";i.r(e);var a=i("984a"),n=i("8e20");for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);i("5cec");var o,u=i("f0c5"),r=Object(u["a"])(n["default"],a["b"],a["c"],!1,null,"c1b93a64",null,!1,a["a"],o);e["default"]=r.exports},"29b4":function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i("8b93"),n=i("d160"),s=i("6c29"),o=u(i("e041"));function u(t){return t&&t.__esModule?t:{default:t}}var r={data:function(){return{imgBaseUrl:getApp().globalData.imgBaseUrl,action:getApp().globalData.imgBaseUrl+"/common/upload/image.html",navHeight:getApp().globalData.navHeight,tabList:["帖子","社团","任务"],active:0,images:["/static/mine/name1.png"],isguan:!1,expressInfo:[],dataList:[],clubList:[],uid:"",header:"",show_attestation:0,name:"",sexCode:0,credit:0,en_year:0,praise_count:0,mySchoolId:"",myId:null,school:{},page:1,status:"loadmore",iconType:"flower",loadText:{loadmore:"上拉或点击",loading:"努力加载中",nomore:"实在没有了"}}},components:{Expressage:o.default},onShareAppMessage:function(e){var i=this;return"button"===e.from&&(0,a.sharePosts)({id:e.target.dataset.id}).then((function(a){200==a.code&&(t.showToast({title:a.message,duration:1500}),i.dataList[e.target.dataset.index].share_num++)})),{title:"动态发布",path:"/pages/community/commDetail/commDetail?id="+e.target.dataset.id,imageUrl:"/static/dongtai/share_dt.png"}},onPullDownRefresh:function(){this.init(),t.stopPullDownRefresh()},onReachBottom:function(){this.loadingMore()},onLoad:function(t){this.uid=t.id,this.getData(),this.getList()},onShow:function(){var e=this;t.getStorage({key:"user",success:function(t){e.mySchoolId=JSON.parse(t.data).school_id,e.myId=JSON.parse(t.data).id}})},methods:{delPost:function(e){var i=this;t.showModal({title:"提示",content:"请确认进行此删除操作",success:function(n){n.confirm?(t.showLoading({title:"加载中...",mask:!0}),(0,a.delPosts)({id:e}).then((function(e){t.hideLoading(),t.showToast({title:e.message,icon:"none"}),200==e.code&&i.init()}))):n.cancel&&console.log("用户点击取消")}})},moreBtn:function(e,i){var a=this;t.showActionSheet({itemList:this.myId==i?["我要删除"]:["我要举报"],itemColor:this.myId==i?"#ff0000":"#000000",success:function(t){a.myId==i?a.delPost(e):a.showModal=!0},fail:function(t){}})},init:function(){this.getData(),this.page=1,this.status="loadmore",0==this.active?(this.dataList=[],this.getList()):1==this.active?(this.clubList=[],this.getClub()):2==this.active&&(this.expressInfo=[],this.getTask())},changeTab:function(t){this.active=t,this.status="loadmore",this.page=1,0==this.active?(this.dataList=[],this.getList()):1==this.active?(this.clubList=[],this.getClub()):2==this.active&&(this.expressInfo=[],this.getTask())},getTask:function(){var e=this;t.showLoading({title:"加载中...",mask:!0}),(0,s.taskList)({where:{task_state_or:[0,1,2,4],user_id:this.uid},page:this.page,limit:10}).then((function(i){t.hideLoading(),200==i.code?e.expressInfo=e.expressInfo.concat(i.result.data):(e.status="nomore",t.showToast({title:i.message,icon:"none"}))}))},getClub:function(){var e=this;t.showLoading({title:"加载中...",mask:!0}),(0,a.getMyClub)({where:{club_auth:[0,1],user_id:this.uid},page:this.page,limit:20}).then((function(i){t.hideLoading(),200==i.code?i.result.list.length?e.clubList=e.clubList.concat(i.result.list):e.status="nomore":t.showToast({title:i.message,icon:"none"})}))},loadingMore:function(){"nomore"!=this.status&&(this.status="loading",this.page=++this.page,0==this.active?this.getList():1==this.active?this.getClub():2==this.active&&this.getTask())},getList:function(){var e=this;t.showLoading({title:"加载中...",mask:!0}),(0,a.getPostsLists)({where:{user_id:this.uid,community_club_id:0},page:this.page,limit:10}).then((function(i){t.hideLoading(),200==i.code?e.dataList=e.dataList.concat(i.result):e.status="nomore"}))},getData:function(){var t=this;(0,n.findUserInfo)({uid:this.uid}).then((function(e){200==e.code&&(t.header=e.result.header,t.show_attestation=e.result.show_attestation,t.name=e.result.name,t.credit=e.result.credit,t.en_year=e.result.en_year,t.sexCode=e.result.sex.code,t.school=e.result.school,t.praise_count=e.result.praise_count)}))},toExpressDetail:function(e){t.navigateTo({url:"/pages/task/taskList/taskDetail/taskDetail?id="+e})},showPop:function(e,i){var a=this,n=[];e.forEach((function(t){n.push(a.imgBaseUrl+t.path)})),t.previewImage({current:i,urls:n})},like:function(e,i){var n=this;(0,a.praisePosts)({id:e}).then((function(e){n.dataList[i].is_praise=!n.dataList[i].is_praise,200==e.code?(n.dataList[i].praise_num++,t.showToast({title:e.message,icon:"none",duration:1500})):1==e.code?n.dataList[i].praise_num--:t.showToast({title:e.message,icon:"none",duration:1500})}))},toClub:function(e){t.navigateTo({url:"/pages/community/club/club?id="+e})},toDetail:function(e){t.navigateTo({url:"/pages/community/commDetail/commDetail?id="+e})}}};e.default=r}).call(this,i("543d")["default"])},"31d3":function(t,e,i){"use strict";var a=i("78be"),n=i.n(a);n.a},"321b":function(t,e,i){"use strict";i.r(e);var a=i("f748"),n=i.n(a);for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);e["default"]=n.a},"5cec":function(t,e,i){"use strict";var a=i("fe74"),n=i.n(a);n.a},"78be":function(t,e,i){},"8e20":function(t,e,i){"use strict";i.r(e);var a=i("29b4"),n=i.n(a);for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);e["default"]=n.a},"984a":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return a}));var a={uIcon:function(){return i.e("node-modules/uview-ui/components/u-icon/u-icon").then(i.bind(null,"21b6"))},uReadMore:function(){return i.e("node-modules/uview-ui/components/u-read-more/u-read-more").then(i.bind(null,"4de6"))},uLoadmore:function(){return i.e("node-modules/uview-ui/components/u-loadmore/u-loadmore").then(i.bind(null,"811d"))}},n=function(){var t=this,e=t.$createElement,i=(t._self._c,0==t.active?t.__map(t.dataList,(function(e,i){var a=t.__get_orig(e),n=t.$u.timeFrom(e.create_time,!1);return{$orig:a,g0:n}})):null);t.$mp.data=Object.assign({},{$root:{l0:i}})},s=[]},aa7d:function(t,e,i){"use strict";var a;i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return a}));var n=function(){var t=this,e=t.$createElement,i=(t._self._c,t.__map(t.curHelpInfo,(function(e,i){var a=t.__get_orig(e),n=t.$u.timeFrom(e.create_time,!1);return{$orig:a,g0:n}})));t.$mp.data=Object.assign({},{$root:{l0:i}})},s=[]},dce6:function(t,e,i){"use strict";(function(t){i("394a");a(i("66fd"));var e=a(i("2129"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,i("543d")["createPage"])},e041:function(t,e,i){"use strict";i.r(e);var a=i("aa7d"),n=i("321b");for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);i("31d3");var o,u=i("f0c5"),r=Object(u["a"])(n["default"],a["b"],a["c"],!1,null,"7efe8fa6",null,!1,a["a"],o);e["default"]=r.exports},f748:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={props:{curHelpInfo:{type:Array,value:[]}},data:function(){return{imgBaseUrl:getApp().globalData.imgBaseUrl}},methods:{toExpressDetail:function(t){this.$emit("toExpressDetail",t)},toMinePage:function(t){this.$emit("toMinePage",t)}}};e.default=a},fe74:function(t,e,i){}},[["dce6","common/runtime","common/vendor"]]]);