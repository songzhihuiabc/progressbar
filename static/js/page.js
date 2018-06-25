/**
 * js分页
 */

 /**
     * 分页组件
     * @param  {[type]} cur      [当前页]
     * @param  {[type]} total    [总页数]
     * @param  {[type]} totalNum [总记录数]
     * @param  {[type]} per      [每页数目]
     * @return {[type]}          [函数会生成分页控件，使用方法：pagination(curPage, totalPage, totalNum, numPerPage);]
     */
    pagination =function(cur,total,totalNum,per){
		var str = '';
		str += '<li class="firstPage"><a href="javascript:void(0)" data-to="1" title="第一页"><<</a></li>';

		if(!per){
			per = 20;
		}
		if(!totalNum){
			totalNum = 0;
		}

		/*if(total==1){
			return false;
		}*/

		if(total<=6){
			for(i=1;i<=total;i++){
		  		str += '<li class="num" ><a href="javascript:void(0)" data-to="'+i+'">'+i+'</a></li>';
			}

		}else{
		if(cur <= 4){
		  str += '<li  class="num"><a href="javascript:void(0)" data-to="1">1</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="2">2</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="3">3</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="4">4</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="5">5</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="6">6</a></li>';
		}
		else if(total-cur <= 1 ){
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="1">1</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="2">2</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="3">3</a></li>';
		  str += '<li class="num disabled" ><a href="javascript:void(0)" data-to="'+(cur)+'">...</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(total-2)+'">'+(total-2)+'</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(total-1)+'">'+(total-1)+'</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+total+'">'+total+'</a></li>';
		}
		else{
		  // str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur-3)+'">'+(cur-3)+'</a></li>';
		  // str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur-2)+'">'+(cur-2)+'</a></li>';
		  // str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur-1)+'">'+(cur-1)+'</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="1">1</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="2">2</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="3">3</a></li>';
		  str += '<li class="num disabled"><a href="javascript:void(0)" data-to="'+cur+'">...</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur-1)+'">'+(cur-1)+'</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur)+'">'+(cur)+'</a></li>';
		  str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur+1)+'">'+(cur+1)+'</a></li>';
		  // str += '<li class="num" ><a href="javascript:void(0)" data-to="'+(cur+3)+'">'+(cur+3)+'</a></li>';
		}
		}
		str += '<li class="lastPage"><a href="javascript:void(0)" data-to="'+total+'" title="最后一页">>></a></li>';
		str += '<li> 共'+total+'页， </li>';
		str += '<li> 每页'+per+'条， </li>';
		str += '<li class="j_pageAmountRecords"> 总计'+totalNum+'条记录</li>';
		// str += '<li> 跳转到  <input type="text" class="input" id="pageNum" data-max="'+total+'"> <i class="fa fa-level-down pointer goto"></i></li>';  // 需求2016-08-05：去掉跳转到指定分页

		if(total<=1){
			str = '';
			// console.log('total')
		}
		
		$("#pageList").html(str).find("a").each(function(){
			if($(this).data("to")==cur && $(this).parent().hasClass("num")){
			  	$(this).parent().addClass("active").siblings().removeClass("active");
			  	if(cur == 1){
			  		$(".firstPage").addClass("disabled");
			  	}else{
			  		$(".firstPage").removeClass("disabled");
			  	}
			  	if(cur == total){$(".lastPage").addClass("disabled")}else{$(".lastPage").removeClass("disabled")}
			}
		});

    }
    //页面跳转部分
    /**
     * rep.gotoFunc(getList);
     * @param  {[type]} func [点击翻页的时候调用的函数]
     */
    gotoFunc=function(func){
    	$("#pageList").on('click', '[data-to]', function(e){
		    e.preventDefault?e.preventDefault():e.returnValue=false;
		    if(!$(this).parent().hasClass("active") && !$(this).parent().hasClass("disabled")){
		      var page = parseInt($(this).data("to"));
		      func(page);
		    }else{

		    }
	  	});

		$("#pageList").on("click", '.goto', function(e){
		  e.preventDefault;
		  var page = parseInt($("#pageNum").val());
		  var max = $(this).data('max');
		  if(!isNaN(page)){
		  	if(page <= 0){ page = 1;}
		  	if(page > max){page = max;}
		    func(page);
		    $('#pageList .num a').each(function(){
	    		if($(this).data('to') == page){
		    		$(this).parent().addClass('active');
		    		$(this).parent().siblings().removeClass('active');
		    	}
		    })

		  }
		});

		$(document).on('keyup', "#pageNum", function(e){
			var max = $(this).data('max');
			if(e.which == 13){
				var page = parseInt($(this).val());
				if(!isNaN(page)){
					if(page <= 0) {page = 1;}
					if(page > max){page = max;}
					func(page);
					$('#pageList .num a').each(function(){
			    		if($(this).data('to') == page){
				    		$(this).parent().addClass('active');
				    		$(this).parent().siblings().removeClass('active');
				    	}
				    })
				}
			}
		});
    }
    gotoFuncService=function(func){
    	$("#pageList").find("[data-to]").on("click",function(e){
		    e.preventDefault?e.preventDefault():e.returnValue=false;
		    if(!$(this).parent().hasClass("current") && !$(this).parent().hasClass("disabled")){
				var page = parseInt($(this).data("to"));
				func(page);
		      	$('#pageList .num a').each(function(){
		    		if($(this).data('to') == page){
			    		$(this).parent().addClass('current');
			    		$(this).parent().siblings().removeClass('current');
			    	}
			    })
		    }else{

		    }
	  	});

    	$(document).on('click', '#pageList .goto', function(e){
    		e.preventDefault;
		  var page = parseInt($("#pageNum").val());
		  if(!isNaN(page)){
		  	if(page <= 0){ page = 1;}
		    func(page);
		    $('#pageList .num a').each(function(){
	    		if($(this).data('to') == page){
		    		$(this).parent().addClass('current');
		    		$(this).parent().siblings().removeClass('current');
		    	}
		    })
		  }
		});

    	$(document).on('keyup', '#pageNum', function(e){
			var max = $(this).data('max');
			if(e.which == 13){
				var page = parseInt($(this).val());
				if(!isNaN(page)){
					if(page <= 0) {page = 1;}
					if(page > max){page = max;}
					func(page);
					$('#pageList .num a').each(function(){
			    		if($(this).data('to') == page){
				    		$(this).parent().addClass('current');
				    		$(this).parent().siblings().removeClass('current');
				    	}
				    })
				}
			}
		});

    }