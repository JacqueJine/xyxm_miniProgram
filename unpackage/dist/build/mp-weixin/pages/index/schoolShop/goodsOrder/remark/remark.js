(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/schoolShop/goodsOrder/remark/remark"],{"1f0d":function(e,t,r){},4109:function(e,t,r){"use strict";var n=r("1f0d"),a=r.n(n);a.a},"61d9":function(e,t,r){"use strict";r.r(t);var n=r("d137"),a=r.n(n);for(var o in n)"default"!==o&&function(e){r.d(t,e,(function(){return n[e]}))}(o);t["default"]=a.a},6524:function(e,t,r){"use strict";var n;r.d(t,"b",(function(){return a})),r.d(t,"c",(function(){return o})),r.d(t,"a",(function(){return n}));var a=function(){var e=this,t=e.$createElement;e._self._c},o=[]},a415:function(e,t,r){"use strict";r.r(t);var n=r("6524"),a=r("61d9");for(var o in a)"default"!==o&&function(e){r.d(t,e,(function(){return a[e]}))}(o);r("4109");var u,i=r("f0c5"),c=Object(i["a"])(a["default"],n["b"],n["c"],!1,null,"77d262d2",null,!1,n["a"],u);t["default"]=c.exports},ca5c:function(e,t,r){"use strict";(function(e){r("394a");n(r("66fd"));var t=n(r("a415"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,r("543d")["createPage"])},d137:function(e,t,r){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r("a34a"));function a(e){return e&&e.__esModule?e:{default:e}}function o(e,t,r,n,a,o,u){try{var i=e[o](u),c=i.value}catch(d){return void r(d)}i.done?t(c):Promise.resolve(c).then(n,a)}function u(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var u=e.apply(t,r);function i(e){o(u,n,a,i,c,"next",e)}function c(e){o(u,n,a,i,c,"throw",e)}i(void 0)}))}}var i={data:function(){return{remark:"",goodsid:"",frompage:"",index:"",type:""}},methods:{submit:function(){var t=this;return u(n.default.mark((function r(){var a;return n.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return a={},"goodsorder"==t.frompage?(a.goodsid=t.goodsid,a.value=t.remark):1==t.type?(a.type=t.type,a.index=t.index,a.value=t.remark):(a.type=t.type,a.value=t.remark),r.prev=2,r.next=5,t.$check.checkTxt(t.remark);case 5:r.sent,r.next=12;break;case 8:return r.prev=8,r.t0=r["catch"](2),t.remark="",r.abrupt("return",!1);case 12:e.setStorage({key:"issueInfo",data:JSON.stringify(a),success:function(){e.navigateBack({delta:1})}});case 13:case"end":return r.stop()}}),r,null,[[2,8]])})))()}},onLoad:function(e){this.frompage=e.frompage,this.remark=e.remark,"goodsorder"==e.frompage?this.goodsid=e.id:1==e.type?(this.type=e.type,this.index=e.index,this.remark=e.remark):(this.type=e.type,this.remark=e.remark)}};t.default=i}).call(this,r("543d")["default"])}},[["ca5c","common/runtime","common/vendor"]]]);