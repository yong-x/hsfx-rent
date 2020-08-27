commonAPI={}


//commonAPI.Server = 'http://10.0.2.2:8080' //模拟器环境下服务器主机
//commonAPI.imgServer = 'http://10.0.2.2:8080'  //模拟器环境下图片服务器主机


commonAPI.Server = 'http://192.168.137.1:8080' //真机环境下服务器主机
commonAPI.imgServer = 'http://192.168.137.1:8080'  //真机环境下图片服务器主机，如果用第三方图像服务器只用更改这里

//将axios封装一些公共配置进行网络请求，
commonAPI.myaxios = function($axios){
	let http = $axios.create({
				baseURL:commonAPI.Server,  //服务器地址
				timeout: 3000,
				headers: {'X-Custom-Header': 'foobar'} 
			});
	/*
	添加响应拦截器,
	服务器正常时：将服务器响应的请求response对象进行处理，返回response.data给 then进行处理
	服务器异常时：将服务器响应的错误对象error直接拦截并提示用户，则不必每次调用myaxios时在catch中处理错误对象了。
	*/
	http.interceptors.response.use(
		function (response) {
				// 对响应数据进行解剖后返回给then(res),则res中接收的就不再是response而是response.data
				return response.data;
			}, function (error) {
				// 对响应错误,提示消息
				let tips = error.message==='Network Error'?'网络异常':(error.message.includes('timeout')?'连接服务器超时':'服务器异常')	
				console.error('axios响应拦截器拦截捕获服务器异常===>')
				console.log(JSON.stringify(error));	
				mui?mui.toast(tips):alert(tips)	//保证在非mui框架下也可用
				return;
				//如果不在响应拦截器对服务器错误进行处理，则直接返回下面语句，然后再catch(error)中就可以完整接收到error对象，并进行catch代码块的处理。
				//return Promise.reject(error);	
			});
	
	return http;

}

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
	console.error('检查登录=>')
	let userJson = localStorage.getItem('user')
	if(!userJson||userJson===''){ //已经保存有登录用户信息，则登录页直接跳转首页					
		commonAPI.openWindow(mui,'login.html',null)														
		return
	}	
}