(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/indexSearch/indexSearch"],{"05f2":function(t,e,o){},b684:function(t,e,o){"use strict";(function(t){o("394a");s(o("66fd"));var e=s(o("e471"));function s(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("543d")["createPage"])},bcd7:function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s=o("3a43"),i={data:function(){return{imgBaseUrl:getApp().globalData.imgBaseUrl,value:"",active:0,navTop:getApp().globalData.navTop,navHeight:getApp().globalData.navHeight,functionList1:["热门商品","热门店铺"],focus:!0,searList:[],shopPage:1,shopList:[],shopStatus:"loading",iconType:"flower",loadText:{loadmore:"轻轻上拉",loading:"努力加载中",nomore:"实在没有了"},goodsLeft:[],goodsRight:[]}},methods:{back:function(){t.navigateBack()},toSearch:function(t){this.value=t},goshop:function(e){t.navigateTo({url:"/pages/index/schoolShop/schoolShop?store_id="+e})},goodsDetial:function(e,o){t.navigateTo({url:"/pages/index/schoolShop/goodsDetail/goodsDetail?id="+e+"&shop_id="+o})},onFocus:function(){this.focus=!0},onSearch:function(){this.searList.unshift(this.value),this.searList=this.searList.filter((function(t,e,o){return o.indexOf(t)===e})),this.focus=!1,t.setStorage({key:"indexHistory",data:this.searList,success:function(){}}),this.shopStatus="loading",this.shopPage=1,0==this.active?(this.goodsLeft=[],this.goodsRight=[],this.getGoods()):(this.shopList=[],this.getShopList())},selected1:function(t){this.active=t,this.shopStatus="loading",this.shopPage=1,0==this.active?(this.goodsLeft=[],this.goodsRight=[],this.getGoods()):(this.shopList=[],this.getShopList())},getShopList:function(){var t=this;(0,s.listStore)({where:{name:this.value},page:this.shopPage,limit:10}).then((function(e){200==e.code?(t.shopList=t.shopList.concat(e.result.data),e.result.count<=10&&(t.shopStatus="nomore"),t.shopPage++):t.shopStatus="nomore"}))},getGoods:function(){var t=this;(0,s.getGood)({where:{shelves:1,name:this.value},page:this.shopPage,limit:20}).then((function(e){if(200==e.code){for(var o in e.result.data)o%2==0?t.goodsLeft.push(e.result.data[o]):t.goodsRight.push(e.result.data[o]);e.result.count<=20&&(t.shopStatus="nomore"),t.shopPage++,console.log(t.shopStatus)}else t.shopStatus="nomore"}))},clearSearch:function(e){"all"==e?(this.searList=[],t.setStorage({key:"indexHistory",data:this.searList,success:function(){}})):(this.searList.splice(e,1),t.setStorage({key:"indexHistory",data:this.searList,success:function(){}}))}},onLoad:function(e){var o=this;t.getStorage({key:"indexHistory",success:function(t){o.searList=t.data}})},onReachBottom:function(){1==this.active&&"loading"==this.shopStatus?this.getShopList():0==this.active&&"loading"==this.shopStatus&&this.getGoods()}};e.default=i}).call(this,o("543d")["default"])},da53:function(t,e,o){"use strict";o.d(e,"b",(function(){return i})),o.d(e,"c",(function(){return n})),o.d(e,"a",(function(){return s}));var s={uIcon:function(){return o.e("node-modules/uview-ui/components/u-icon/u-icon").then(o.bind(null,"21b6"))},uSearch:function(){return o.e("node-modules/uview-ui/components/u-search/u-search").then(o.bind(null,"69f2"))},uLoadmore:function(){return o.e("node-modules/uview-ui/components/u-loadmore/u-loadmore").then(o.bind(null,"811d"))}},i=function(){var t=this,e=t.$createElement;t._self._c},n=[]},e471:function(t,e,o){"use strict";o.r(e);var s=o("da53"),i=o("e6b3");for(var n in i)"default"!==n&&function(t){o.d(e,t,(function(){return i[t]}))}(n);o("fe2f");var a,u=o("f0c5"),c=Object(u["a"])(i["default"],s["b"],s["c"],!1,null,"7a1f9cae",null,!1,s["a"],a);e["default"]=c.exports},e6b3:function(t,e,o){"use strict";o.r(e);var s=o("bcd7"),i=o.n(s);for(var n in s)"default"!==n&&function(t){o.d(e,t,(function(){return s[t]}))}(n);e["default"]=i.a},fe2f:function(t,e,o){"use strict";var s=o("05f2"),i=o.n(s);i.a}},[["b684","common/runtime","common/vendor"]]]);