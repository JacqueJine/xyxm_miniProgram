(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["node-modules/uview-ui/components/u-notice-bar/u-notice-bar"],{"0bf0":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o={name:"u-notice-bar",props:{list:{type:Array,default:function(){return[]}},type:{type:String,default:"warning"},volumeIcon:{type:Boolean,default:!0},volumeSize:{type:[Number,String],default:34},moreIcon:{type:Boolean,default:!1},closeIcon:{type:Boolean,default:!1},autoplay:{type:Boolean,default:!0},color:{type:String,default:""},bgColor:{type:String,default:""},mode:{type:String,default:"horizontal"},show:{type:Boolean,default:!0},fontSize:{type:[Number,String],default:28},duration:{type:[Number,String],default:2e3},speed:{type:[Number,String],default:160},isCircular:{type:Boolean,default:!0},playState:{type:String,default:"play"},disableTouch:{type:Boolean,default:!0},borderRadius:{type:[Number,String],default:0},padding:{type:[Number,String],default:"18rpx 24rpx"},noListHidden:{type:Boolean,default:!0}},computed:{isShow:function(){return 0!=this.show&&(1!=this.noListHidden||0!=this.list.length)}},methods:{click:function(e){this.$emit("click",e)},close:function(){this.$emit("close")},getMore:function(){this.$emit("getMore")},end:function(){this.$emit("end")}}};t.default=o},"13d6":function(e,t,n){"use strict";n.r(t);var o=n("44a8"),u=n("2478");for(var i in u)"default"!==i&&function(e){n.d(t,e,(function(){return u[e]}))}(i);n("a44a");var r,a=n("f0c5"),l=Object(a["a"])(u["default"],o["b"],o["c"],!1,null,"92eb2222",null,!1,o["a"],r);t["default"]=l.exports},2478:function(e,t,n){"use strict";n.r(t);var o=n("0bf0"),u=n.n(o);for(var i in o)"default"!==i&&function(e){n.d(t,e,(function(){return o[e]}))}(i);t["default"]=u.a},"44a8":function(e,t,n){"use strict";n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return o}));var o={uRowNotice:function(){return n.e("node-modules/uview-ui/components/u-row-notice/u-row-notice").then(n.bind(null,"262e"))},uColumnNotice:function(){return n.e("node-modules/uview-ui/components/u-column-notice/u-column-notice").then(n.bind(null,"7617"))}},u=function(){var e=this,t=e.$createElement;e._self._c},i=[]},"60dd":function(e,t,n){},a44a:function(e,t,n){"use strict";var o=n("60dd"),u=n.n(o);u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'node-modules/uview-ui/components/u-notice-bar/u-notice-bar-create-component',
    {
        'node-modules/uview-ui/components/u-notice-bar/u-notice-bar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("13d6"))
        })
    },
    [['node-modules/uview-ui/components/u-notice-bar/u-notice-bar-create-component']]
]);
