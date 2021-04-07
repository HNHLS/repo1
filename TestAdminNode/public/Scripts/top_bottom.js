$(document).ready(function(){
			function keydown(e){
　 var e=e||event;
　 var currKey=e.keyCode||e.which||e.charCode;

	 var inp = $('input:text'); //找到所有的文本框
 

		var  valuee = inp.attr("value")
		console.log(valuee)
$("input:text").each(function () {                                // 循环表单中所有的 text
            $(this).keyup(function () {     
	
					//当按 下移 键触发事件
					                  
                if (event.keyCode == 40) {                            
                    var idx = inp.index(this);               		  //得到当前文本框的 索引
					
				wqk =  $(this).attr('name');
				var zheyige = $("input[name='"+wqk+"']").parent().siblings().find($('input:text')).length+1
				//console.log( '按的下键，这一个为'+zheyige+'个')
				var xiayige =   $("input[name='"+wqk+"']").parent().parent().next().children().find($('input:text')).length
				//console.log('下一个为'+xiayige+'个')
				
				if((zheyige-xiayige == 2 )||(xiayige-zheyige == 2 )){
					   inp[idx + Math.ceil((zheyige+xiayige)/2)+1].focus();       
				}else{
					inp[idx + Math.ceil((zheyige+xiayige)/2)].focus();      
				}			

                 }
             
				   //当按上移键触发事件   

                if(event.keyCode==38){    
                var idx=inp.index(this);

				 wqk =  $(this).attr('name');
				var zheyige = $("input[name='"+wqk+"']").parent().siblings().find($('input:text')).length+1
				
//				获取上一个tr的td个数
				var shangyige =   $("input[name='"+wqk+"']").parent().parent().prev().children().find($('input:text')).length
			
				if((zheyige-shangyige == 2 )||(shangyige-zheyige == 2 )){
					 inp[idx - Math.ceil((zheyige+shangyige)/2)-1].focus();
				}else{
					  inp[idx - Math.ceil((zheyige+shangyige)/2)].focus();
				}

                 }

				 if(event.keyCode==39){       //当按右移键触发事件
                    var idx=inp.index(this);
                     if(idx!=inp.length-1){
                        inp[idx+1].focus();
                      }
                 }
                if(event.keyCode==37){       //当按左移键触发事件
                    var idx=inp.index(this);
                     if(idx!=1){//判断当前焦点不是对一个文本框
                        inp[idx-1].focus();
                     }
                 }

               
            });
     
      });
  
}
document.onkeydown = keydown;

})