function href(url,firstname,secondname,thirdname){
	if(url!=""){
		$("body",parent.document).find('.am-breadcrumb').html('<li><a href="javascript:void(0)"><img src="/Images/home.png" />首页</a></li><li><a href="javascript:void(0)">'+firstname+'</a></li><li><a class="href" data-href="'+url+'">'+secondname+'</a></li><li class="am-active" id="title">'+thirdname+'</li>');
		$("body",parent.document).find(".href").click(function(){
			$("body",parent.document).find('#iframe1').attr("src", $(this).attr("data-href"));
		})
	}else{
		$("body",parent.document).find('.am-breadcrumb').html('<li><a href="javascript:void(0)"><img src="/Images/home.png" />首页</a></li><li><a href="javascript:void(0)">'+firstname+'</a></li><li class="am-active" id="title">'+secondname+'</li>');
	}
}
