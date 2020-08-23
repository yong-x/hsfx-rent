/*
下面公共配置一个公共axios实例，指定的配置将与实例的公共配置合并，例如myaxios.post(url,{},config)其config将会与本实例公共配置合并，
对于指定配置与公共配置相冲突的属性，指定配置会覆盖公共配置。
*/
const myaxios = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  timeout: 2000,
  headers: {'X-Custom-Header': 'foobar'},  
});
	
	
