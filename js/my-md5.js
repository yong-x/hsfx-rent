var mymd5 = {}
// 前端数据加密方法
mymd5.hash=function(pwd,salt,$md5){
	return $md5($md5($md5(pwd)+salt)+salt); //MD5固定盐值多次加密
}