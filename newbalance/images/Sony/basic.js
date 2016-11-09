domEl = {};
domEl.window = $(window);
domEl.body = $("body");

/*************** 按浏览器的屏幕分辨率为BODY元素添加样式 *********************/

domEl.addBodyStyle = function(){
	var w = $(window).width();
	if(w >= 1200){
		domEl.body.addClass("w1200");
	}else{
		domEl.body.removeClass("w1200");
	}
	if(w < 960){
		$("html").addClass("w960");
	}else{
		$("html").removeClass("w960");
	}
};

/******************* 添加各种mouseover的展示效果 *************************/

domEl.addEffect = function(){
	
	$(".storiesListBlock, .hoverMotionBlock,.productStoreListBlock,.ProductsListBlock").each(function(index,el){
		$(el).bind("mouseenter",function(){
			if($(el).hasClass("enter")) return false;
			$(el).addClass("enter");
			setTimeout(function(){
				if($(el).hasClass("enter")){
					$(el).find("div").slideDown(300);
				}
			},200)
		})
		$(el).bind("mouseleave",function(){
			$(el).removeClass("enter");
			$(el).find("div").stop(true, true).slideUp(200);
		})
	})
	
	$("#headerNav .hasSubMenu").each(function(index,el){
		$(el).bind("mouseenter",function(){
			//$(el).addClass("hover");
			$($(".subMenuBlock")[index]).show();
		})
		$(el).bind("mouseleave",function(){
			//$(el).removeClass("hover");
			$($(".subMenuBlock")[index]).hide();
		})
	})

}

domEl.reSizeText = function(elem,n){
	$(elem).each(function(index,el){
		var t = $(el).html().length;
		if(t >= n){
			var text = $(el).html().substring(0,n-1)+"…";
		}
		$(el).html(text);
	})
}

/*************** 获取随机数 *********************/

domEl.getRandomNumber = function(num){
	var n = Math.floor(Math.random()*num);
	return n;
}

/*************** 随机出现KV *********************/

domEl.randomKv = function(){
	if($("#kv .kvList").length > 0){
		var kvList = $("#kv .kvList");
		var showNum = domEl.getRandomNumber(kvList.length);
		$(kvList[showNum]).siblings().remove();
		var kvImg = $(kvList[showNum]).find("img");
		
		var imgSrc = $(kvImg[0]).attr("img-data");
		var img = new Image();
		img.onload = function(){
			$("#kv .link").show();
			$('#kv img.Kvimg2').show();
		}
		img.src = imgSrc;
		
		kvImg.each(function(index,el){
			var url = $(el).attr("img-data");
			$(el).attr("src",url);
			if($(el).hasClass("linkImg")){
				$(el).bind("mouseenter",function(){
					var hoverUrl = $(el).attr("hover-data");
					$(el).attr("src",hoverUrl);
				})
				$(el).bind("mouseleave",function(){
					var url = $(el).attr("img-data");
					$(el).attr("src",url);
				})
			}
		})
	}
}

/********************* 全屏滚动的javascript效果 ***********************/

domEl.bannerSlideAction = function(el,pageList){
	var self = this;
	
	self.area = $(el);
	self.pageArea = $(pageList);
	self.block = $(el).find("ul").eq(0);
	
	self.def = function(){
		self.list = $(el).find("li");
		self.listNum = self.list.length;
		self.defW = 240;
		self.now = 0;
		
		self.page = Math.ceil(self.listNum/4);
		self.move = self.defW*4;
	
		$(self.block).css("width",self.defW*self.listNum+"px");
		$(self.pageArea).html("");
		
		for(var i=0; i<self.page; i++){
			var link = $('<span class="innerBlock"></span>').appendTo(self.pageArea);
			$(link).hover(function(){
				$(this).addClass("hover");
			},
			function(){
				$(this).removeClass("hover");
			})
			link.index = i;
			if(i == 0){link.addClass("active");}
		}
	}
	
	self.def();
	
	self.leftButton = $(el).find(".prevButton");
	self.rightButton = $(el).find(".nextButton");
	self.leftMark = $(el).find(".leftMark");
	self.rightMark = $(el).find(".rightMark");
	
	self.motion = function(){
		$(self.block).animate({
			left:self.left*-1
		},600,function(){
			self.key = 0;
			if(self.now == 0){
				self.leftButton.hide();
				//self.rightButton.show();
			}else if(self.now == self.page-1){
				//self.leftButton.show();
				self.rightButton.hide();
			}else{
				//self.leftButton.show();
				//self.rightButton.show();
			}
		})
	}
	
	self.resetGallery = function(){
		self.def();
	}
	
	self.reSizeMarkWidth = function(){
		var markWidth = ($("body").width()-960)/2;
		$(".motionMark").css("width",markWidth);
		$(el).find(".leftMark").css('left',markWidth*-1);
		$(el).find(".rightMark").css('right',markWidth*-1);
	}
	
	self.pageArea.delegate("span","click",function(e){
		self.key = 1;
		self.pageArea.find("span").removeClass("active");
		$(e.currentTarget).addClass("active");
		self.now = (self.now != $(e.currentTarget).index()) ? $(e.currentTarget).index() : self.now;
		
		self.left = Math.min(self.now*4*self.defW , self.defW*(self.listNum-4));
		self.left = Math.max(self.left , 0);
		
		self.motion();
		return false;
	})
	
	$(self.leftButton).bind("click",function(event){
		if(self.now == 0 || self.key == 1) return false;
		self.key = 1;
		self.now--;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.rightButton).bind("click",function(event){
		if(self.now == self.page-1 || self.key == 1) return false;
		self.key = 1;
		self.now++;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.leftMark).bind("click",function(event){
		if(self.now == 0 || self.key == 1) return false;
		self.key = 1;
		self.now--;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.rightMark).bind("click",function(event){
		if(self.now == self.page-1 || self.key == 1) return false;
		self.key = 1;
		self.now++;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(".leftMark, .prevButton").bind("mouseenter",function(){
		if(self.leftButton.css("display") == "none"){
			if(self.now != 0 ) self.leftButton.show();
		}
	})
	
	$(".leftMark, .prevButton").bind("mouseleave",function(){
		self.leftButton.hide();
	})
	
	$(".rightMark, .nextButton").bind("mouseenter",function(){
		if(self.leftButton.css("display") == "none"){
			if(self.now != self.page-1 ) self.rightButton.show();
		}
	})
	
	$(".rightMark, .nextButton").bind("mouseleave",function(){
		self.rightButton.hide();
	})
	
	self.reSizeMarkWidth();
	
	$(window).resize(function(){
		self.reSizeMarkWidth();
	});
	
}


/********************* gallery javascript效果 ***********************/

domEl.gallerySlideAction = function(el,pageList){
	var self = this;
	
	self.area = $(el);
	self.pageArea = $(pageList);
	self.block = $(el).find("ul").eq(0);
	
	self.def = function(){
		self.list = $(el).find("li");
		self.listNum = self.list.length;
		self.defW = 240;
		self.now = 0;
		
		self.page = Math.ceil(self.listNum/4);
		self.move = self.defW*4;
		
		$(self.leftButton).hide();
		if(self.page > 1){
			$(self.rightButton).show();
		}
	
		$(self.block).css("width",self.defW*self.listNum+"px");
		$(self.pageArea).html("");
		
		for(var i=0; i<self.page; i++){
			var link = $('<span class="innerBlock"></span>').appendTo(self.pageArea);
			$(link).hover(function(){
				$(this).addClass("hover");
			},
			function(){
				$(this).removeClass("hover");
			})
			link.index = i;
			if(i == 0){link.addClass("active")}
		}
		//console.log(self.listNum);
		if(self.listNum <= 4){
			$(self.rightMark).hide();
			$(self.leftMark).hide();
			$(self.rightButton).hide();
			$(self.leftButton).hide();
		}
		domEl.reSizeText($("#galleryData p"),91);
	}
	
	self.def();
	
	self.leftButton = $(el).find(".prevButton");
	self.rightButton = $(el).find(".nextButton");
	self.leftMark = $(el).find(".leftMark");
	self.rightMark = $(el).find(".rightMark");
	
	self.motion = function(){
		$(self.block).animate({
			left:self.left*-1
		},600,function(){
			self.key = 0;
			if(self.now == 0){
				self.leftButton.hide();
				self.rightButton.show();
			}else if(self.now == self.page-1){
				self.leftButton.show();
				self.rightButton.hide();
			}else{
				self.leftButton.show();
				self.rightButton.show();
			}
		})
	}
	
	self.resetGallery = function(){
		self.def();
	}
	
	self.reSizeMarkWidth = function(){
		var markWidth = ($("body").width()-960)/2;
		$(".motionMark").css("width",markWidth);
		$(el).find(".leftMark").css('left',markWidth*-1);
		$(el).find(".rightMark").css('right',markWidth*-1);
	}
	
	self.pageArea.delegate("span","click",function(e){
		self.key = 1;
		self.pageArea.find("span").removeClass("active");
		$(e.currentTarget).addClass("active");
		self.now = (self.now != $(e.currentTarget).index()) ? $(e.currentTarget).index() : self.now;
		
		self.left = self.now*4*self.defW;
		self.left = Math.max(self.left , 0);
		
		self.motion();
		return false;
	})
	
	$(self.leftButton).bind("click",function(event){
		if(self.now == 0 || self.key == 1) return false;
		self.key = 1;
		self.now--;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.rightButton).bind("click",function(event){
		if(self.now == self.page-1 || self.key == 1) return false;
		self.key = 1;
		self.now++;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.leftMark).bind("click",function(event){
		if(self.now == 0 || self.key == 1) return false;
		self.key = 1;
		self.now--;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	$(self.rightMark).bind("click",function(event){
		if(self.now == self.page-1 || self.key == 1) return false;
		self.key = 1;
		self.now++;
		self.pageArea.find("span").eq(self.now).click();
		return false;
	})
	
	//console.log(self.listNum);
	
	
	self.reSizeMarkWidth();
	
	$(window).resize(function(){
		self.reSizeMarkWidth();
	});
	
}

/*************** 图库浮层效果 *********************/

domEl.createGallery = function(){
	
	var self = this;
	self.galleryList = $("#galleryData a");
	self.galleryNumber = self.galleryList.length;
	self.key = 1;
	self.typeArr = {};
	self.now = 0;
	
	var wh = $(window).height()-201;
	$("#markBoxGallery").css("height",wh);
	$("body").addClass("overflowHidden");
	$("#mainAll").hide();
	
	//$(window).css("overflow","hidden");
	
	self.resizeImg = function(){
		var w = $("#middlePicture").width();
		var h = $("#middlePicture").height();
		
		if($(window).height() < 650){
			var area_h = 650-321;
		}else{
			var area_h = $(window).height()-321;
		}
		
		if(h != area_h){
			var per = area_h/h;
			h = area_h;
			w = Math.ceil(w*per);
		}
		
		var maxw = (self.nowImg_width > 798) ? 798 : self.nowImg_width;
		
		if(w > maxw){
			var per = maxw/w;
			w = maxw;
			h = Math.ceil(h*per);
		}
		//$("#galleryArea").css("height",h－100);
		var mtb = (area_h-h)/2+"px";
		$("#middlePicture").css({"width":w,"height":h,"visibility":"visible","margin-top":mtb,"margin-bottom":mtb});
		$("#middlePicture").css("display","block");
		$("#galleryArea").css({"height":h+(area_h-h)});
		
		var keyLeft = (960-80)/2;
		$("#galleryKey").css("left",keyLeft+"px");
		
		self.rest();
	}
	
	$("#galleryData p").each(function(index,el){
		//console.log($(el).outerHeight())
		if($(el).outerHeight() < 86){
			$(el).css("height", "62px");
		}
	})
	
	self.showImage = function(){
		var img = new Image();
		img.onload = function(){
			$("#galleryArea").html("");
			var middleImg = $("<img>").attr("id","middlePicture").appendTo($("#galleryArea"));
			$("#middlePicture").attr("src",self.middlePicture);
			setTimeout(function(){
				self.nowImg_width = $("#middlePicture").width();
				self.nowImg_height = $("#middlePicture").height();
				var w = $("#middlePicture").width();
				var h = $("#middlePicture").height();
				if(w > 798){
					var per = 798/w;
					w = 798;
					h = Math.ceil(h*per);
				}
				
				var area_h = $(window).height()-321;
				if(h > area_h){
					var per = area_h/h;
					h = area_h;
					w = Math.ceil(w*per);
				}
				var mtb = (area_h-h)/2+"px";
				$("#middlePicture").css({"width":w,"height":h,"margin-top":mtb,"margin-bottom":mtb,"visibility":"visible"});
				$("#middlePicture").css("display","block");
				$("#markBoxGallery").css("height","auto");
				self.resizeImg();
				self.rest();
			},100)
		}
		
		img.src = self.middlePicture;
	}
	
	$("#galleryData").delegate("a","click",function(e){
		$("#middlePicture").css("visibility","hidden");
		self.middlePicture = $(e.currentTarget).attr("href");
		self.now = $(e.currentTarget).attr("index");
		self.showImage();
		$(".galleryPhotoButton").show();
		//$("#galleryListArea").hide();
		return false;
	})
	
	$("#galleryData a").each(function(index,el){
		var typeName = $(el).attr("type");
		if(self.typeArr[typeName] == undefined){
			self.typeArr[typeName] = [];
		}
		self.typeArr[typeName].push(index);
	})
	
	self.listDiv = $("<div>").css("display","none").appendTo($("#galleryListArea"));
	$("#galleryData li").appendTo(self.listDiv);
	$(self.listDiv).find('a').each(function(index,el){
		$(el).attr("index",index);
	})
	
	$("#galleryTypeList").delegate("a","click",function(e){
		var n = $(e.currentTarget).attr('id');
		$("#galleryData").html("");
		$("#galleryData").css("left",0);
		if(self.typeArr[n] == undefined){
			self.listDiv.find("li").each(function(index,el){
				$(el).clone().appendTo($("#galleryData"));
			})
		}else{
			var l = self.listDiv.find("li");
			for(var i = 0; i<self.typeArr[n].length; i++){
				var m = self.typeArr[n][i];
				$(l[m]).clone().appendTo($("#galleryData"));
			}
		}
		/*if(self.gallerySlide != undefined){
			self.gallerySlide.delete;
		}*/
		self.gallerySlide.resetGallery();
		
		$("#galleryTypeList a").removeClass("active");
		$(e.currentTarget).addClass("active");
		$(".galleryPhotoButton").hide();
		return false;
	})
	
	$("#galleryData").delegate("a","mouseenter",function(e){
		var pp = $(e.currentTarget).find("p").eq(0);
		$(pp).slideDown(300);
		return false;
	})
	
	$("#galleryData").delegate("a","mouseleave",function(e){
		var pp = $(e.currentTarget).find("p").eq(0);
		$(pp).slideUp(200);
		return false;
	})
	
	var typeLink = '<li><a id="allPhotoLink" href="#"></a></li>';
	for(var i in self.typeArr){
		var t = '<li><a href="#" id="'+i+'"></a></li>';
		typeLink += t;
	}
	$("#galleryTypeList").html(typeLink);
	if($("#galleryTypeList li").length == 2){
		$("#galleryTypeList li").eq(1).remove();
	}
	
	$("#sonyBoxGalleryFooter").bind("mouseenter",function(){
		if(self.key == 1) return false;
		self.key = 1;
		$("#galleryListArea").fadeIn("normal",function(){
			self.key = 0;
		});
	})
	
	$("#sonyBoxGalleryFooter").bind("mouseleave",function(){
		if(self.key == 1) return false;
		self.key = 1;
		$("#galleryListArea").fadeOut("fast",function(){
			self.key = 0;
		});
	})
	
	self.gallerySlide = new domEl.gallerySlideAction("#galleryListBlock","#galleryPage");
	$("#galleryTypeList a").eq(0).click();
	$("#galleryData a").eq(0).click();
	setTimeout(function(){
		$("#galleryListArea").fadeOut("fast",function(){
			self.key = 0;
		});
	},600);
	
	self.rest = function(){
		var fullWidth = $("#markBoxGallery").width();
		var fullHeight = $("#markBoxGallery").height();
		var markWidth = (fullWidth-600)/2;
		$(".galleryPhotoButton").css({"width":markWidth,"height":fullHeight});
		
		var left = (fullWidth-960)/2-70;
		var right = (960-798)/2+120;
		$("#galleryPhotoDown").css("background-position",left+"px center");
		$("#galleryPhotoUp").css("background-position",right+"px center");
	}
	
	$(".galleryPhotoButton").each(function(index,el){
		$(el).bind("mouseenter",function(){
			$(el).removeClass("alpha0");
		})
		$(el).bind("mouseleave",function(){
			$(el).addClass("alpha0");
		})
	})
	
	$("#galleryPhotoUp").bind("click",function(){
		var li = $(self.listDiv).find('a');
		self.now++;
		if(self.now >= li.length){
			self.now = 0;
		}
		self.middlePicture = $(li[self.now]).attr("href");
		self.showImage();
	})
	
	$("#galleryPhotoDown").bind("click",function(){
		var li = $(self.listDiv).find('a');
		self.now--;
		if(self.now < 0){
			self.now = li.length-1;
		}
		self.middlePicture = $(li[self.now]).attr("href");
		self.showImage();
	})
	
	//domEl.reSizeText($("#galleryData p"),91);
	
	if(self.galleryNumber == 1){
		//console.log(self.galleryNumber);
		$("#galleryPhotoUp,#galleryPhotoDown").remove();
	}
	
	$("#galleryKey").bind("click",function(){
		if($("#galleryListArea").css("display") == "none"){
			if(self.key == 1) return false;
			self.key = 1;
			$("#galleryListArea").fadeIn("normal",function(){
				self.key = 0;
			});
		}
		return false;
	})
	
	var keyLeft = (960-80)/2;
	$("#galleryKey").css("left",keyLeft+"px");
	
	$(window).resize(function(){
		self.resizeImg();
	});

}


/*************** 将地址字符串后的参数转换为数组返回 *********************/

domEl.tb_parseQuery = function(query) {
	var Params = {};
	if ( ! query ) {return Params;}
	var Pairs = query.split(/[;&]/);
	for ( var i = 0; i < Pairs.length; i++ ){
		var KeyVal = Pairs[i].split('=');
		if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
		var key = unescape( KeyVal[0] );
		var val = unescape( KeyVal[1] );
		val = val.replace(/\+/g, ' ');
		Params[key] = val;
	}
	return Params;
}

domEl.QueryString = function(url){
	var queryString = url.replace(/^[^\?]+\??/,'');
	var params = domEl.tb_parseQuery(queryString);
	return params;
}

/*************** 新闻浮层效果 *********************/
// 取得当前页面滚动高度并纪录下来
// 展开浮层显示新闻内容，并根据新闻内容自适应高度
// 关闭浮层后将底层页面滚动到展开浮层前的位置

domEl.sonyBox = function(){
	var self = this;
	
	//关闭浮层
	
	self.Recenspace = function(Html){   
        rs=new ActiveXObject("ADODB.RecordSet");   
        rs.fields.append("a",201,1);   
        rs.open();         
        rs.addNew();   
        rs(0).appendChunk(Html);   
        rs.update();   
        return rs(0).value;   
        rs.close();
    }
    
    if(window.ActiveXObject){
        isie = true;
    }else{
        isie = false;
    }
    
	self.closeSonyBox = function(){
		$("#sonyBoxBg, #sonyBox").remove();
		domEl.window.scrollTop(self.windowScroll);
	}
	
	self.createBox = function(){
	
		//创建浮层的html结构
		
		self.h = $(window).height()+100;
		if($("#sonyBoxBg").length < 1){
			self.boxBg = $("<div>").attr("id","sonyBoxBg").css("height",self.h).appendTo(domEl.body).addClass("fixed-top");
		}
		
		if(self.boxObj.type == "html" || self.boxObj.type == "gallery" || self.boxObj.type == "yuanliu"){
			
			
			$.ajax({
				url:self.url,
				dataType:"html",
				success:function(data){
					domEl.window.scrollTop(0);
					$(data).appendTo(domEl.body);
					$("#sonyBoxBg").show();
					$("#sonyBox").fadeIn("nomal");
					if(self.boxObj.type == "gallery"){
						domEl.createGallery();
					}
					if(self.boxObj.type == "yuanliu"){
						self.yuanliuSlide = new domEl.bannerSlideAction("#slideListBlock","#slidePage");
					}
				}
			})
		}
	}
	
	self.openSonyBox = function(){
		self.boxObj = domEl.QueryString(self.url);
		$("#sonyBox").remove();
		self.createBox();
	}
	
	self.init = function(){
		self.link = $(".sonyBox");
		self.link.each(function(index,el){
			$(el).bind("click",function(e){
				self.windowScroll = domEl.window.scrollTop();
				self.url = $(el).attr("href");
				self.openSonyBox();
				return false;
			})
		})
		
		$("#sonyBoxHeader").live("mouseenter",function(){
			$("#prevPage, #nextPage").fadeIn();
		})
		
		$("#sonyBoxHeader").live("mouseleave",function(){
			$("#prevPage, #nextPage").fadeOut();
		})
		
		$("#sonyBoxClose").live("click",function(){
			$("#mainAll").show();
			self.closeSonyBox();
			$("body").removeClass("overflowHidden");
			return false;
		})
		
		$(".sonyBox").live("click",function(e){
			self.url = $(this).attr("href");
			self.openSonyBox();
			return false;
		})
		
		$("#sonyBoxFooter").live("mouseenter",function(){
			$(this).addClass("hover");
		})
		
		$("#sonyBoxFooter").live("mouseleave",function(){
			$(this).removeClass("hover");
		})
	}
	
	self.init();
}

/*************** 页面ready和页面resize *********************/

$(document).ready(function(){
	domEl.addBodyStyle();
	domEl.randomKv();
	domEl.addEffect();
	domEl.box = new domEl.sonyBox();
	
	if($("#NewRecommendBannerArea").length > 0){
		domEl.bannerSlide = new domEl.bannerSlideAction("#NewRecommendBannerArea","#NewRecommendPage");
	}
	
	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
		DD_belatedPNG.fix('.pngfix');
	}

})

$(window).resize(function(){
	domEl.addBodyStyle();
});