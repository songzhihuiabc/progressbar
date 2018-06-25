$(function(){
	let $doc = $(document.body);
	let $navName = $('input[name="navName"]');
	let $navId = $('input[name="navId"]');
	let $errorAddNav = $('.j_addErrorNav');
	let $errorEditNav = $('.j_editErrorNav');
	let $prevTr = "";
	let $editTr = "";
	let $deleteTr = "";
	let len = 0;
	let strHtml = '';
	let $tBody = $('.j_tBody');
	let operateIndex = "";  //点击编辑的索引值


	// ============================================================================
    // ========================= 二级导航编辑部分 ===================================
    // =============================================================================

    changeArrow();
    judgeBtnShow();
    showOperate();

	// 添加二级导航
	$doc.on('click', '.j_add', function(e) {
		e.preventDefault();

		$('.j_mask').show();
		$('.j_addSubNav').show();
		$doc.css('overflow',"hidden");
	})

	// 添加时点击关闭按钮
	$doc.on('click', '.j_addClose', function(e) {
		e.preventDefault();

		clearDialog();
		$('.j_mask').hide();
		$('.j_addSubNav').hide();
		$doc.css('overflow',"auto");
	})

	// 添加时点击确认按钮
	$doc.on('click', '.j_addConfirm', function(e) {
		e.preventDefault();

		let $addSubNav = $('.j_addSubNav');
		let navNameValue = $addSubNav.find($navName).val().trim();
		let navIdValue = $addSubNav.find($navId).val().trim();

		if(navNameValue == "") {
			$('.j_addErrorNav').html("请填写二级导航名称");
		} else if(getByteLen(navNameValue) > 12) {
			$('.j_addErrorNav').html("不得超出6个汉字");
		} else if(navIdValue == "") {
			$('.j_addErrorNav').html("请填写店铺ID");
		} else {
			$('.j_addErrorNav').html("");
			$.ajax({
				url: "/scene/apiGetStore",
				data: {
					"store_sn": navIdValue
				},
				type: "post",
				dataType: 'json',
				success: function(res) {
					if(res.code == 0) {
						let storeName = res.data.store.title;
						let index = $('.j_navItem').length;

						strHtml = `<tr class="j_navItem navItem" data-name="${navNameValue}" data-store="${navIdValue}">
										<td class="nav-name">${navNameValue}</td>
										<td class="nav-store">${storeName}</td>
										<td class="showNone j_operate">
											<i class="icon-arrow-up j_moveUp" data-index="${index}" title="上移"></i>
											<i class="icon-arrow-down j_moveDown" data-index="${index}" title="下移"></i>
											<i class="icon-pencil j_edit" title="编辑" data-navName="${navNameValue}" data-navId="${navIdValue}" data-index="${index}"></i>
											<i class="icon-remove j_delete" title="删除" data-index="${index}"></i>
										</td>
									</tr>`;

						clearDialog();
						$('.j_mask').hide();
						$('.j_addSubNav').hide();
						$doc.css('overflow',"auto");
						$tBody.append(strHtml);
						changeArrow();
						judgeBtnShow();
					} else {
						$('.j_addErrorNav').html(res.msg)
					}
				}
			})
		}

		showOperate();
	})

	function showOperate()
	{
		$doc.on('mouseenter', '.j_navItem', function(){
			$('.j_operate').addClass("showNone");
			$(this).find('.j_operate').removeClass("showNone");
		})

		$doc.on('mouseleave', '.j_navItem', function(){
			$(this).find('.j_operate').addClass("showNone");
		})
	}

	// 编辑二级导航
	$doc.on('click', '.j_edit', function(e) {
		e.preventDefault();
		$editTr = $(this).parents('.j_navItem');
		operateIndex = $(this).attr('data-index');
		let navNameValue = $(this).attr("data-navName");
		let navIdValue = $(this).attr("data-navId");

		$('.j_editSubNav').find($navName).val(navNameValue);
		$('.j_editSubNav').find($navId).val(navIdValue);
		$('.j_mask').show();
		$('.j_editSubNav').show();
		$doc.css('overflow',"hidden");
	})

	// 编辑时点击关闭按钮
	$doc.on('click', '.j_editClose', function(e) {
		e.preventDefault();

		clearDialog();
		$('.j_mask').hide();
		$('.j_editSubNav').hide();
		$doc.css('overflow',"auto");
	})

	// 编辑时点击确认按钮
	$doc.on('click', '.j_editConfirm', function(e) {
		e.preventDefault();

		let $editSubNav = $('.j_editSubNav');
		let navNameValue = $editSubNav.find($navName).val().trim();
		let navIdValue = $editSubNav.find($navId).val().trim();

		if(navNameValue == "") {
			$('.j_editErrorNav').html("请填写二级导航名称");
		} else if(getByteLen(navNameValue) > 12) {
			$('.j_editErrorNav').html("不得超出6个汉字");
		} else if(navIdValue == "") {
			$('.j_editErrorNav').html("请填写店铺ID");
		} else {
			$('.j_editErrorNav').html("");
			$.ajax({
				url: "/scene/apiGetStore",
				data: {
					"store_sn": navIdValue
				},
				type: 'post',
				dataType: 'json',
				success: function(res) {
					if(res.code == 0) {
						let storeName = res.data.store.title;

						strHtml = `
									<td class="nav-name">${navNameValue}</td>
									<td class="nav-store">${storeName}</td>
									<td class="j_operate">
										<i class="icon-arrow-up j_moveUp" title="上移" data-index="${operateIndex}"></i>
										<i class="icon-arrow-down j_moveDown" title="下移" data-index="${operateIndex}"></i>
										<i class="icon-pencil j_edit" title="编辑" data-navName="${navNameValue}" data-navId="${navIdValue}" data-index="${operateIndex}"></i>
										<i class="icon-remove j_delete" title="删除" data-index="${operateIndex}"></i>
									</td>`;

						clearDialog();
						$('.j_mask').hide();
						$('.j_editSubNav').hide();
						$doc.css('overflow',"auto");
						$editTr.attr({"data-name": navNameValue, "data-store": navIdValue});
						$editTr.html(strHtml);
						changeArrow();
					} else {
						$('.j_editErrorNav').html(res.msg)
					}
				}
			})
		}

		showOperate();
	})

	// 删除二级导航
	$doc.on('click', '.j_delete', function(e) {
		e.preventDefault();

		$deleteTr = $(this).parents('tr');
		operateIndex = $(this).attr("data-index");
		$('.j_mask').show();
		$('.j_deleteSubNav').show();
		$doc.css('overflow',"hidden");
	})

	// 删除时点击关闭按钮
	$doc.on('click', '.j_deleteClose', function(e) {
		e.preventDefault();

		clearDialog();
		$('.j_mask').hide();
		$('.j_deleteSubNav').hide();
		$doc.css('overflow',"auto");
	})

	// 删除时点击确认按钮
	$doc.on('click', '.j_deleteConfirm', function(e) {
		e.preventDefault();
		$('.j_mask').hide();
		$('.j_deleteSubNav').hide();
		$doc.css('overflow',"auto");
		$deleteTr.remove();
		changeArrow();
		judgeBtnShow();

		showOperate();
	})

	// 删除时点击取消按钮
	$doc.on('click', '.j_deleteCancel', function(e) {
		e.preventDefault();
		$('.j_mask').hide();
		$('.j_deleteSubNav').hide();
		$doc.css('overflow',"auto");
	})

	// 上移操作
	$doc.on('click', '.j_moveUp', function(e) {
		e.preventDefault();
		let $moveEle = $(this).parents('.j_navItem');       //要移动的元素
		operateIndex = $(this).attr('data-index');          //当前元素的索引值
		$moveEle.prev().before($moveEle);

		changeArrow();

		showOperate();
	});

	// 下移操作
	$doc.on('click', '.j_moveDown', function(e) {
		e.preventDefault();
		let $moveEle = $(this).parents('.j_navItem');		//要移动的元素
		operateIndex = $(this).attr('data-index');          //当前元素的索引值
		$moveEle.next().after($moveEle);

		changeArrow();
		showOperate();
	});

	// 改变箭头的显示情况
	function changeArrow()
	{
		len = $('.j_navItem').length;
		let $navItem = $('.j_navItem');

		if(len == 1) {
			$navItem.find('.j_moveUp, .j_moveDown, .j_delete, .j_edit').attr('data-index', 0);
			$navItem.find('.j_moveUp, .j_moveDown').hide();
		} else {
			// 中间的元素，向上、向下、删除都显示
	        for (let i = 0; i < len; i++)
	        {
	            $navItem.eq(i).find('.j_moveUp, .j_moveDown, .j_delete, .j_edit').show();
	            $navItem.eq(i).find('.j_moveUp, .j_moveDown, .j_delete, .j_edit').attr('data-index', i);
	        }

			$navItem.first().find('.j_moveUp').hide();
			$navItem.last().find('.j_moveDown').hide();
		}
	}

	//清除页面弹窗内容
	function clearDialog()
	{
		$errorAddNav.html('');
		$navName.val('');
		$navId.val('');
		$errorEditNav.html('');
	}


	function judgeBtnShow()
	{
		if($('.j_navItem').length >= 20) {
			$('.j_add').hide();
		} else {
			$('.j_add').show();
		}
	}


	// ============================================================================
    // ========================= 场景编辑部分 =======================================
    // =============================================================================

    // 点击提交按钮
    $doc.on('click', '.j_submit', function(e){

    	e.preventDefault();
    	let sceneNameVal = $('input[name="name"]').val().trim();
    	let pageNameVal = $('input[name="page_name"]').val().trim();
    	let imgTitleVal = $('input[name="imgTitle"]').val().trim();
    	let remarkVal = $('[name="remark"]').val().trim();
    	let imgVal = $('.j_uploadImg').attr('data-src');
    	let sceneSnVal = $('#scene_sn').val().trim();
    	let enName = $('input[name="enName"]').val().trim();
    	let iconFont = $('input[name="iconFont"]').val().trim();
    	let flag = true;
    	let navFlag = true;
    	let navVal = [];

    	getNavVal();
    	judgeNavName();

    	//场景名称
    	if(sceneNameVal == "") {
    		$('.j_errorName').html('请填写场景名称');
    		flag = false;
    	} else if(getByteLen(sceneNameVal) > 12) {
    		$('.j_errorName').html('不得超出6个汉字');
    		flag = false;
    	} else {
    		$('.j_errorName').html('');
    	}

    	// 英文名称
    	if(enName == "") {
    		$('.j_errorEnName').html('请填写英文名称');
    		flag = false;
    	} else if(getByteLen(enName) > 12){
			$('.j_errorEnName').html('不得超出12个字符');
			flag = false;
    	} else if(!/[a-zA-Z\s]/.test(enName)){
    		$('.j_errorEnName').html('请输入英文或者空格');
			flag = false;
    	} else {
    		$('.j_errorEnName').html('');
    	}

    	// icon字体
    	if(iconFont == "") {
    		$('.j_errorFont').html('请填写icon字体');
    		flag = false;
    	} else if(getByteLen(iconFont) > 30) {
    		$('.j_errorFont').html('不得超出30个字符');
    		flag = false;
    	} else {
    		$('.j_errorFont').html('');
    	}

    	//场景页面名称
    	if(pageNameVal == "") {
    		$('.j_errorPageName').html('请填写场景页面名称');
    		flag = false;
    	} else if( getByteLen(pageNameVal) > 12) {
    		$('.j_errorPageName').html('不得超出6个汉字');
    		flag = false;
    	} else {
    		$('.j_errorPageName').html('');
    	}

    	// 场景缩略图
    	if(imgVal == "") {
    		$('.j_errorImg').html('请上传场景缩略图');
    		flag = false;
    	} else {
    		$('.j_errorImg').html('');
    	}

    	// 图片标题
    	if(imgTitleVal == "") {
    		$('.j_errorImgTitle').html('请填写图片标题');
    		flag = false;
    	} else if(getByteLen(imgTitleVal) > 20) {
    		$('.j_errorImgTitle').html('图片标题需在10个汉字以内');
    		flag = false;
    	} else {
    		$('.j_errorImgTitle').html('');
    	}

    	// 图片描述
    	if(remarkVal == "") {
    		$('.j_errorRemark').html('请填写文字描述');
    		flag = false;
    	} else if(getByteLen(remarkVal) > 60) {
    		$('.j_errorRemark').html('文字描述需在30个汉字以内');
    		flag = false;
    	} else {
    		$('.j_errorRemark').html('');
    	}

    	// 二级导航数量
    	if(navFlag == false) {
    		$('.j_errorNav').html('二级导航名称不得重复');
    		flag = false;
    	} else if(navVal.length < 2) {
    		$('.j_errorNav').html('单个场景下二级导航不得少于2个');
    		flag = false;
    	} else {
    		$('.j_errorNav').html('');
    	}

    	if(flag) {
    		$.ajax({
    			url: '/scene/apiSaveBase',
    			data: {
    				"scene_sn": sceneSnVal,
    				"name": sceneNameVal,
    				"en_name": enName,
    				"icon_font": iconFont,
    				"page_name": pageNameVal,
    				"thumbnail": [{
    					"img": imgVal,
    					"name": imgTitleVal,
    					"remark": remarkVal
    				}],
    				"nav": navVal
    			},
    			type: 'post',
    			dataType: 'json',
    			success: function(res){
    				if(res.code == 0) {
    					jQuery.bsAlert('保存成功',function(){},'提示');
    				} else if(res.code == -100) {
    					$('.j_errorImg').html(res.msg);
    				} else {
    					$('.j_errorNav').html(res.msg);
    				}
    			}
    		})
    	}

    	// 判断二级导航名称
    	function judgeNavName()
    	{
	    	let navLen =  $('.j_navItem').length;

	    	for(i = 0; i < navLen - 1; i++) {
	    		for(let j = i + 1; j < navLen; j++) {
	    			let navNameVal = $('.j_navItem').eq(i).attr('data-name');
	    			let navNextNameVal = $('.j_navItem').eq(j).attr('data-name');

	    			if(navNameVal == navNextNameVal) {
		    			navFlag = false;
		    		}
	    		}
	    	}
    	}

    	// 获取页面中输出的二级导航的值
		function getNavVal()
		{
			let $navItem = $('.j_navItem');
			let navLen = $navItem.length;
			if(navLen > 0) {
				for(var i = 0; i < navLen; i ++) {
					navVal.push({"name": $navItem.eq(i).attr('data-name'), "store" : $navItem.eq(i).attr('data-store')});
				}
			} else {
				return false;
			}
		}

    })

    // 点击返回按钮
    $doc.on('click', '.j_return', function(e){
    	e.preventDefault();

    	let userAgent = navigator.userAgent;
    	if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {

			window.location.href = "/scene/pList";

		} else {

		   window.opener = null;

		   window.open("", "_self");

		   window.close();
		}
    })

    // 鼠标悬浮【上传图片】按钮，将上传组件的表单覆盖在其上方
	$doc.on('mouseenter', '.j_imgBox', function(){
	    $(this).css('position', 'relative');
	    $(this).append($('#imageUpload'));
	    $('#imageUpload').show();
	    $('#imageUpload').css({
	        width:'100%',
	        height:'100%'
	    });
	});

	// 鼠标离开【上传图片】按钮，将上传组件的表单从其上方转移
	$doc.on('mouseleave', '.j_imgBox', function(){
	    $('body').append($('#imageUpload'));
	    $('#imageUpload').hide();
	    $('#imageUpload').css({
	        width:'auto',
	        height:'auto'
	    });
	});

	// 点击上传图片时，获得当前上传部件的容器
	$doc.on('click', '.j_imgBox' , function(e) {

	    var $that = $(this);
	    window.currentUpload = $that.parents('.j_upload');
	});

	// 图片上传提交表单
	$('#picture').on('change', function(e){

	    // 仅支持 JPG,PNG,JPEG 格式。
	    var img = checkImg($(this));
	    if(!img){return img;}
	    $('#imageUpload').submit();
	});

	// 回调函数，上传完成后，要清空之前的 file值，否则再次上传同一张图片有问题
	window.upCallBack = function(data) {
	    // 清空 file 字段的值
	    $('#picture').val('');

	    if(!data.code){

	        // 将新上传的图片的url赋值给input作为待上传的字段
	        window.currentUpload.find('.j_uploadInput').val(data.data.image);

	        // 将新上传的图片显示输出
	        window.currentUpload.find('.j_uploadImg').attr('src', IMAGE_DOMAIN + data.data.image +'/500');
	        $('.j_errorImg').html('');
	        window.currentUpload.find('.j_uploadImg').attr("data-src", data.data.image);
	        window.currentUpload.find('.j_uploadImg').removeClass("hide");
	        window.currentUpload.find(".j_imgBox").addClass("hasImg");
	    } else {

	        jQuery.bsAlert(data.msg,function(){}, '提示');
	    }
	};


	// 获取字节数
	function getByteLen(str)
	{
		let result = 0,
			regChineses = /[^x00-xff]/ig,
			regSpecial = /[ ~!@#$%&*()-+={}"\|',.\/]/ig,
			len = str.length,
			i = 0

		for(; i < len; i++) {
			regChineses.lastIndex = 0
			regSpecial.lastIndex = 0
			result += (regChineses.test(str[i]) && !regSpecial.test(str[i]) ? 2 : 1)
		}

		return result;
	}

	/**
     * 检测图片属性
     * @param  {[type]}   obj      [传入一个对象]
     * @param  {Function} callback [回调，暂时没有使用]
     * @param  {[type]}   size     [图片的体积大小，可以为5M,20K,等]
     * @return {[type]}            [description]
     */
    function checkImg (obj, callback, size)
    {

		var sizeByte ; //把 size 转换为 byte
		var file = obj[0].files[0];


		if($.browser.isIE && $.browser.version < 10){}

		else{

		  var type = /image\/(png|jpg|jpeg)/

		  if(!type.test(file.type)){
		    jQuery.bsAlert('仅支持 JPG,PNG,JPEG 格式。',function(){}, '提示')
		    return false;
		  }
		}

		return true;
	}


	(function($){

        var ua = navigator.userAgent,
            match = /(Trident).*rv:([\d.]+)/i.exec(ua) ||
                    /(MSIE) ([\d.]+)/i.exec(ua) ||
                    /(Firefox)\/([\d.]+)/i.exec(ua) ||
                    /(Opera).*version\/([\d.]+)/i.exec(ua) ||
                    /(OPR)\/([\d.]+)/i.exec(ua) ||
                    /(Chrome)\/([\d.]+) safari\/([\d.]+)/i.exec(ua) ||
                    /apple(Webkit).*version\/([\d.]+) safari/i.exec(ua) ||
                    [],
            name = match[1] || '',
            nameLower = name.toLowerCase(),
            version = match[2] || '';

        if(nameLower !== 'chrome' && nameLower === 'webkit')
        {
            name = 'Safari';
        }
        else if(nameLower === 'opr')
        {
            name = 'Opera'; // Opera自14.0版本后就使用了Webkit内核，UA字符串中的Opera也因此变更为OPR
        }
        else if(nameLower === 'trident' || nameLower === 'msie')
        {
            name = 'IE'; // IE浏览器从11.0版本开始，在UA中不再包含“MSIE 10.0”类似的信息，与之替代的是：Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
        }

        name = name.toLowerCase();

        $.browser = {
            name: name,   // 浏览器名称（如 'ie', 'firefox', 'safari', 'chrome', 'opera'）
            version: version,         // 浏览器版本（如 '45.0.2454.101'）
            isIE: name === 'ie',
            isLessIE9: !document.getSelection  // IE6~8不支持document.getSelection属性
        };

        // make a console function for ie
        if($.browser.isLessIE9) {
            window.console = {};
            window.console.log = function(){
                return 'ie sucks';
            };
        }
    })(jQuery);
})
