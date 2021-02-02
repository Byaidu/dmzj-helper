// ==UserScript==
// @name         ☄️动漫之家增强☄️
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  动漫之家去广告🚫，对日漫版漫画页进行增强：并排布局📖、图片高度自适应↕️、辅助翻页↔️、暗夜模式🌙
// @author       Byaidu
// @match        *.dmzj.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    //去广告
    GM_addStyle('*[style*="2147"]{display:none !important;}')
    GM_addStyle('*[style*="hidden;border"]{display:none !important;}')
    GM_addStyle('.ad_bottom_code{display:none !important;}')
    GM_addStyle('.ad{display:none !important;}')
    //去二维码
    GM_addStyle('.footer{display:none !important;}')
    GM_addStyle('.foot{display:none !important;}')
    GM_addStyle('.float_code{display:none !important;}')
    //漫画并页排布
    GM_addStyle('#center_box{justify-content:center;flex-direction: row-reverse;display: flex;flex-wrap: wrap;}')
    //漫画高度自适应
    GM_addStyle('#center_box img{height:100vh !important;border:0px !important;padding:0px !important;}')
    //漫画上下间隔缩小
    GM_addStyle('.inner_img{margin-top:20px !important;}')
    //漫画页暗夜模式
    if(location.href.indexOf("shtml")>=0){
        GM_addStyle('*{background: rgb(25,25,25) !important;}')
    }
    //切换到上下滚动阅读
    if($.cookie('display_mode')==0){
        $.cookie('display_mode',1,{expires:999999,path:'/'});
        location.reload();
    }
    //上下方向键滚动页面，左右方向键切换章节
    let img_id=0
    $("body").keydown(function(event) {
        if (event.keyCode == 38) {
            if (img_id>0){
                if ($("#img_"+img_id).length>0&&$("#img_"+(img_id-1)).length>0&&$("#img_"+img_id).offset().top==$("#img_"+(img_id-1)).offset().top){
                    img_id-=2
                }else{
                    img_id-=1
                }
            }
            $("html,body").animate({scrollTop: $("#img_"+img_id).offset().top}, 1000);
        } else if (event.keyCode == 40) {
            if ($("#img_"+img_id).length>0&&$("#img_"+(img_id+1)).length>0&&$("#img_"+img_id).offset().top==$("#img_"+(img_id+1)).offset().top){
                img_id+=2
            }else{
                img_id+=1
            }
            $("html,body").animate({scrollTop: $("#img_"+img_id).offset().top}, 1000);
        } else if (event.keyCode == 37) {
            location.href = $("#prev_chapter").attr("href");
        } else if (event.keyCode == 39) {
            location.href = $("#next_chapter").attr("href");
        }
    })
    //去除原来的keydown事件
    //https://stackoverflow.com/questions/5436874/how-do-i-unbind-jquery-event-handlers-in-greasemonkey
    window.addEventListener('load', function ()
    {
        jQuery = unsafeWindow['jQuery'];
        jQuery("body").off("keydown");
    })
})();
