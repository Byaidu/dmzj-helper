// ==UserScript==
// @name         ☄️动漫之家增强☄️
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  动漫之家去广告🚫，对日漫版漫画页进行增强：并排布局📖、图片高度自适应↕️、辅助翻页↔️、页码显示⏱、暗夜模式🌙
// @author       Byaidu
// @match        *.dmzj.com/*
// @resource     animate_css https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    //去广告
    GM_addStyle('*[style*="2147"]{display:none !important;}')
    GM_addStyle('*[style*="hidden;border"]{display:none !important;}')
    GM_addStyle('.ad_bottom_code{display:none !important;}')
    GM_addStyle('.ad{display:none !important;}')
    GM_addStyle('#app_manhua{display:none !important;}')
    //去二维码
    GM_addStyle('.footer{display:none !important;}')
    GM_addStyle('.foot{display:none !important;}')
    GM_addStyle('.float_code{display:none !important;}')
    //漫画页检测
    if(location.href.indexOf("shtml")>=0){
        //切换到上下滚动阅读
        if($.cookie('display_mode')==0){
            $.cookie('display_mode',1,{expires:999999,path:'/'});
            location.reload();
        }
        //漫画并页排布
        GM_addStyle('#center_box{justify-content:center;flex-direction: row-reverse;display: flex;flex-wrap: wrap;}')
        //漫画高度自适应
        GM_addStyle('#center_box img{height:100vh !important;border:0px !important;padding:0px !important;}')
        //漫画上下间隔缩小
        GM_addStyle('.inner_img{margin-top:20px !important;}')
        //修改配色方案
        GM_addStyle('.r1{color:#4d4d4d !important;}')
        GM_addStyle('.hotrm_about{color:#4d4d4d !important;}')
        GM_addStyle('*[style*="display:inline;float:left"]{color:#4d4d4d !important;}')
        GM_addStyle('*[style*="display:inline;float:right"]{display:none !important;}')
        //引入animate.css
        const animate_css = GM_getResourceText("animate_css");
        GM_addStyle(animate_css);
        GM_addStyle(':root{--animate-duration:500ms;}')
        //添加右下角菜单
        let info = "<div id=\"info\" @mouseover=\"show=1\" @mouseleave=\"show=0\">"+
            "<transition name=\"custom-classes-transition\" enter-active-class=\"animate__animated animate__fadeIn\" leave-active-class=\"animate__animated animate__fadeOut\">"+
            "<template v-if=\"show\"><div id=\"info_skip\" class=\"info_item\" @click=\"switch_skip\" style=\"cursor:pointer;\">📖更改跨页</div></template></transition>"+
            "<transition name=\"custom-classes-transition\" enter-active-class=\"animate__animated animate__fadeIn\" leave-active-class=\"animate__animated animate__fadeOut\">"+
            "<template v-if=\"show\"><div id=\"info_switch\" class=\"info_item\" @click=\"switch_night\" style=\"cursor:pointer;\">{{message_switch}}</div></template></transition>"+
            "<template><div id=\"info_count\" class=\"info_item\">{{message_count}}</div></template>"+
            "</div>";
        let $info = $(info);
        $("body").append($info);
        let info_style = "#info {"+
            "bottom: 2%;"+
            "right: 2%;"+
            "padding: 5px 5px;"+
            "background: rgba(48,48,48,.7) !important;"+
            "position: fixed;"+
            "color: rgba(255,255,255,.7);"+
            "border-radius: 3px;"+
            "}";
        GM_addStyle(info_style)
        GM_addStyle(".info_item{padding:5px 0px;width:120px;}")
        GM_addStyle('.skip{display:none !important;}')
        //漫画页暗夜模式
        //日夜模式需要切换的元素
        GM_addStyle(".theme_dark .mainNav,.theme_dark .header-box,.theme_dark .display_graybg,.theme_dark body,.theme_dark .funcdiv{background:#212121 !important;}")
        if ($.cookie('dark_mode') === undefined) { $.cookie('dark_mode',true,{expires:999999,path:'/'}); }
        var dark_mode = $.cookie('dark_mode')=='true';
        if (dark_mode){
            $('html').addClass('theme_dark');
        }else{
            $('html').removeClass('theme_dark');
        }
        //vue绑定右下角菜单
        var info_app = new Vue({
            el: '#info',
            data: {
                dark:dark_mode,
                show:0,
                img_id:0,
                skip:0
            },
            computed: {
                message_switch:  function () {
                    return this.dark?'☀️日间模式':'🌙夜间模式'
                },
                message_count:  function () {
                    return this.img_id+'/'+g_max_pic_count
                }
            },
            methods:{
                switch_night: function(){
                    this.dark=!this.dark
                    $.cookie('dark_mode',this.dark,{expires:999999,path:'/'});
                    if (this.dark){
                        $('html').addClass('theme_dark');
                    }else{
                        $('html').removeClass('theme_dark');
                    }
                },
                switch_skip: function(){
                    this.skip=!this.skip
                    if (this.skip){
                        $("#center_box>div:first-child").addClass('skip');
                    }else{
                        $("#center_box>div:first-child").removeClass('skip');
                    }
                },
            }
        })
        //上下方向键滚动页面，左右方向键切换章节
        let img_id=0;
        $("body").keydown(function(event) {
            if (event.keyCode == 38) {
                if (img_id>=1){
                    if ($("#img_"+img_id).length>0&&$("#img_"+(img_id-1)).length>0&&$("#img_"+img_id).offset().top==$("#img_"+(img_id-1)).offset().top){
                        img_id-=2;
                    }else{
                        img_id-=1;
                    }
                }
                info_app.img_id=img_id;
                if (img_id!=0) $("html,body").stop()
                $("html,body").animate({scrollTop: $("#img_"+img_id).offset().top}, 500);
            } else if (event.keyCode == 40) {
                if (img_id<=g_max_pic_count){
                    if ($("#img_"+img_id).length>0&&$("#img_"+(img_id+1)).length>0&&$("#img_"+img_id).offset().top==$("#img_"+(img_id+1)).offset().top){
                        img_id+=2;
                    }else{
                        img_id+=1;
                    }
                }
                info_app.img_id=img_id;
                if (img_id!=g_max_pic_count+1) $("html,body").stop()
                $("html,body").animate({scrollTop: $("#img_"+img_id).offset().top}, 500);
            } else if (event.keyCode == 37) {
                let location_new = $("#prev_chapter").attr("href");
                if(location_new.indexOf("shtml")>=0)
                    location.href = location_new;
            } else if (event.keyCode == 39) {
                let location_new = $("#next_chapter").attr("href");
                if(location_new.indexOf("shtml")>=0)
                    location.href = location_new;
            }
        })
        //resize事件触发图片和浏览器对齐
        $(window).resize(function() {
            $("html,body").animate({scrollTop: $("#img_"+img_id).offset().top}, 0);
        })
        //去除原来的keydown事件
        //https://stackoverflow.com/questions/5436874/how-do-i-unbind-jquery-event-handlers-in-greasemonkey
        window.addEventListener('load', function (){
            jQuery = unsafeWindow['jQuery'];
            jQuery("body").off("keydown");
        })
    }
})();
