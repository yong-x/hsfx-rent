/*
下面公共配置一个公共axios实例，指定的配置将与实例的公共配置合并，例如myaxios.post(url,{},config)其config将会与本实例公共配置合并，
对于指定配置与公共配置相冲突的属性，指定配置会覆盖公共配置。
*/
const myaxios = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  //timeout: 2000,
  headers: {'X-Custom-Header': 'foobar'} 
});
// 添加响应拦截器,
//服务器正常时：将服务器响应的请求response对象进行处理，返回response.data给 then进行处理
//服务器异常时：将服务器响应的错误对象error直接拦截并提示用户，则不必每次调用myaxios时在catch中处理错误对象了。
myaxios.interceptors.response.use(function (response) {
    // 对响应数据进行解剖后返回给then(res),则res中接收的就不再是response而是response.data
    return response.data;
  }, function (error) {
    // 对响应错误,直接返回
	console.error('axios响应拦截器拦截捕获服务器异常===>')
	console.log(JSON.stringify(error));	
	mui?mui.toast('服务器异常'):alert('服务器异常')	//保证在非mui框架下也可用
	return;
	//如果不在响应拦截器对服务器错误进行处理，则直接返回下面语句，然后再catch(error)中就可以完整接收到error对象，并进行catch代码块的处理。
    //return Promise.reject(error);	
  });	
	
