$(document).ready(function () {
 	var mySwiper = new Swiper ('.swiper-container', {
    loop: true,

    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },

  })
})

//全局变量
var scrollT = 0;
var contentHeight = $('.preview-content')[0].scrollHeight - 553;//内容高度
var scrollBoxH = $('.scrollbox').height() - 50;//滚动条的总高度
var barTop = 0;
var scrollBarNowT = 0;//纪录最新的滚动条的高度

 /*监听鼠标滚动事件
 * 1.火狐的是：DOMMouseScroll;
 * 2.IE/Opera/Chrome：直接添加事件*/
if(document.getElementsByClassName('preview-content')[0].addEventListener){
    document.getElementsByClassName('preview-content')[0].addEventListener('DOMMouseScroll',scrollFunc,false);
}//W3C

// window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome

document.getElementsByClassName('preview-content')[0].onmousewheel=scrollFunc;

function scrollFunc(e){
    e=e || window.event;
    if(e.wheelDelta){//IE/Opera/Chrome
        //自定义事件：编写具体的实现逻辑
        mouseScroll(e);
    }else if(e.detail){//Firefox
        //自定义事件：编写具体的实现逻辑
        mouseScrollFirefox(e);
    }
}

function mouseScroll(e) {

	//IE/Opera/Chrome
	if(typeof e.wheelDelta !== undefined && e.wheelDelta < 0) {

		scrollT += 50;

		//如果大于内容高度就等于内容高度
		if(scrollT >= contentHeight) scrollT = contentHeight;

		//当前滚动条的top值
		barTop = scrollT / contentHeight * scrollBoxH;

		$('.preview-content').scrollTop(scrollT);
		$('.scrollbox').css('top', scrollT);
		$('.scrollBar').css({
			'top': barTop,
		});

		scrollBarNowH = $('.scrollBar').position().top;
	}
	else if(e.wheelDelta > 0) {//向上滚动

		scrollT -= 50;

		//如果小于内容高度就等于0
		if(scrollT <= 0)  scrollT = 0;

		//当前滚动条的top值
		barTop = (scrollT / contentHeight * scrollBoxH);

		$('.preview-content').scrollTop(scrollT);
		$('.scrollbox').css('top', scrollT);
		$('.scrollBar').css({
			'top': barTop,
		});
	}
};


function mouseScrollFirefox(e) {

	//火狐
	if(e.detail > 0) {//向下滚动
		console.log('向下滚动')
	}
	else if(e.detail < 0) {//向上滚动
		console.log('向上滚动')
	}
}
