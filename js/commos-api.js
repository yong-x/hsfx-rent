commonAPI={}

commonAPI.openWindow= function($mui,url,extras){	//打开新窗口
	$mui.openWindow({
		url:url,
		id:url,				    				    
		createNew:false,
		extras:extras,
		show:{
		autoShow:true,
		aniShow:'slide-in-right',
		duration:200
		},
		waiting:{
		autoShow:true,
		title:'正在加载...'					      
		}
	})	
}

commonAPI.checkLogin = function(){ //打开新窗口时，检查用户是否登录过，没有登录过则跳转登录
	let userJson = localStorage.getItem('user')
	mui.toast(userJson)
	if(userJson){ //已经保存有登录用户信息，则登录页直接跳转首页					
		commonAPI.openWindow(mui,'login.html',null)														
		return
	}	
}