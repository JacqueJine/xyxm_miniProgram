(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/mine/mineHelp/creditPoints/creditPoints"],{"2f4a":function(t,e,n){"use strict";var o=n("46d9"),r=n.n(o);r.a},"46d9":function(t,e,n){},"53fe":function(t,e,n){"use strict";n.r(e);var o=n("5660"),r=n("84c1");for(var u in r)"default"!==u&&function(t){n.d(e,t,(function(){return r[t]}))}(u);n("2f4a");var i,a=n("f0c5"),c=Object(a["a"])(r["default"],o["b"],o["c"],!1,null,"02ea0a5a",null,!1,o["a"],i);e["default"]=c.exports},5660:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return o}));var o={uLoadmore:function(){return n.e("node-modules/uview-ui/components/u-loadmore/u-loadmore").then(n.bind(null,"811d"))}},r=function(){var t=this,e=t.$createElement;t._self._c},u=[]},"84c1":function(t,e,n){"use strict";n.r(e);var o=n("a569"),r=n.n(o);for(var u in o)"default"!==u&&function(t){n.d(e,t,(function(){return o[t]}))}(u);e["default"]=r.a},a569:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n("d160"),r={data:function(){return{list:[],credit:0,page:1,status:"loading",iconType:"flower",loadText:{loadmore:"轻轻上拉",loading:"努力加载中",nomore:"实在没有了"}}},methods:{getCredit:function(){var t=this;if(this.noMore)return!1;(0,o.getUserCredits)({page:this.page,limit:10}).then((function(e){200==e.code?(t.list=t.list.concat(e.result.list),t.credit=e.result.credit,t.page++,e.result.count<=10&&(t.status="nomore")):t.status="nomore"}))}},onLoad:function(){this.getCredit()},onReachBottom:function(){if("nomore"==this.status)return!1;this.getCredit()}};e.default=r},b801:function(t,e,n){"use strict";(function(t){n("394a");o(n("66fd"));var e=o(n("53fe"));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])}},[["b801","common/runtime","common/vendor"]]]);