/**
 * Created by Administrator on 2016/11/27.
 */
$(function () {
    //菜单
    $(".menu>ul>li").off("click");
    $(".menu>ul>li").on("click",function () {
        //加载页面
        var url=$(this).attr("url");
        url=url+"?time="+new Date().getTime();
        $(".mainRight").load(url);
        //点击菜单时样式的变化
        $(this).children().eq(1).addClass("sHidden");
        $(this).siblings().children().siblings().removeClass("sHidden");
        $(this).addClass("current");
        $(this).siblings().removeClass("current");
    });
    //模拟点击事件
    $(".menu>ul>li").eq(4).trigger("click");


});