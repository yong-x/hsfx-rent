/*!
 * ======================================================
 * FeedBack Template For MUI (http://dev.dcloud.net.cn/mui)
 * =======================================================
 * @version:1.0.0
 * @author:cuihongbao@dcloud.io
 */
(function() {
	/*检查登录状态
	*/
	let userJson = localStorage.getItem('user')
	console.error('已经保存的登录用户=>'+ userJson)
	if(!userJson){ //如果用户没有登录则跳转登录					
		commonAPI.openWindow(mui,'login.html',null)
		return																					
	}
	//取出登录用户信息，方便下面取用
	var user = JSON.parse(userJson)
			
	var index = 1;
	var size = null;
	var imageIndexIdNum = 0;
	var starIndex = 0;
	var feedback = { //要上传的数据，等下验证后在上传
		taglist:  document.getElementById('taglist'), 
		house_detail:  document.getElementById('house_detail'), 
		house_address:  document.getElementById('house_address'), 
		price_monthly:  document.getElementById('price_monthly'), 
		imageList: document.getElementById('imglist'),
		publisher_phone: user.phone+'', //后面上传时所有值必须为字符串
		publisher_uid: user.uid+'',  //后面上传时所有值必须为字符串
		submitBtn: document.getElementById('submit')
	};
	mui.toast(feedback.question)
	//var url = 'https://service.dcloud.net.cn/feedback';
	var url = 'http://10.0.2.2:3000/feedback';
	var url = commonAPI.Server+'/house/add';
	feedback.files = [];
	feedback.uploader = null;  
	feedback.deviceInfo = null; 
	mui.plusReady(function() {
		//设备信息，无需修改
		
		feedback.deviceInfo = {
			appid: plus.runtime.appid, 
			imei: plus.device.imei, //设备标识
			images: feedback.files, //图片文件
			p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os:  mui.os.version,
			net: ''+plus.networkinfo.getCurrentType()
		}
		
	   
	}); 
	/**
	 *提交成功之后，恢复表单项 
	 */
	feedback.clearForm = function() {				
		feedback.taglist.value = '';		
		feedback.house_detail.value = '';		
		feedback.house_address.value = '';		
		feedback.price_monthly.value = '';									
		feedback.imageList.innerHTML = '';
		feedback.newPlaceholder();
		feedback.files = [];
		index = 0;
		size = 0;
		imageIndexIdNum = 0;
		starIndex = 0;
		
	};
	feedback.getFileInputArray = function() {
		return [].slice.call(feedback.imageList.querySelectorAll('.file'));
	};
	feedback.addFile = function(path) {		
		feedback.files.push({name:"images"+index,path:path,id:"img-"+index});
		index++;
	};
	/**
	 * 初始化图片域占位
	 */
	feedback.newPlaceholder = function() {
		var fileInputArray = feedback.getFileInputArray();
		if (fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		};
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		var up = document.createElement("div");
		up.setAttribute('class','image-up')
		//删除图片
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.id = "img-"+index;
		//小X的点击事件
		closeButton.addEventListener('tap', function(event) {
			setTimeout(function() {
				for(var temp=0;temp<feedback.files.length;temp++){
					if(feedback.files[temp].id==closeButton.id){
						feedback.files.splice(temp,1);
					}
				}
				feedback.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		
		//
		var fileInput = document.createElement('div');
		fileInput.setAttribute('class', 'file');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('tap', function(event) {
			var self = this;
			var index = (this.id).substr(-1);
			
			plus.gallery.pick(function(e) {
//				console.log("event:"+e);
				var name = e.substr(e.lastIndexOf('/') + 1);
				console.log("name:"+name);
					
				plus.zip.compressImage({
					src: e,
					dst: '_doc/' + name,
					overwrite: true,
					quality: 50
				}, function(zip) {
					size += zip.size  
					console.log("filesize:"+zip.size+",totalsize:"+size);
					if (size > (10*1024*1024)) {
						return mui.toast('文件超大,请重新选择~');
					}
					if (!self.parentNode.classList.contains('space')) { //已有图片
						feedback.files.splice(index-1,1,{name:"images"+index,path:e});
					} else { //加号
						placeholder.classList.remove('space');
						feedback.addFile(zip.target);
						feedback.newPlaceholder();
					}
					up.classList.remove('image-up');
					placeholder.style.backgroundImage = 'url(' + zip.target + ')';
				}, function(zipe) {
					mui.toast('压缩失败！')
				});				
			}, function(e) {
				mui.toast(e.message);
			},{});
		}, false);
		placeholder.appendChild(closeButton);
		placeholder.appendChild(up);
		placeholder.appendChild(fileInput);
		feedback.imageList.appendChild(placeholder);
	};
	feedback.newPlaceholder();
	feedback.submitBtn.addEventListener('tap', function(event) {		
		/************************************************/
		/*此处进行数据格式校验，数据域不合格，应该直接return ,不进行后面的服务器上传*/
		/************************************************/
																
		//判断网络连接
		if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
			return mui.toast("连接网络失败，请稍后再试");
		}
		
		/************************************************/
		/*所有数据域都需要添加到这里，然后在上传之前进行数据格式校验；校验通过后与图片一起上传到服务器*/
		/************************************************/
		feedback.send(mui.extend({}, feedback.deviceInfo, {
					
			taglist: feedback.taglist.value,
			house_detail: feedback.house_detail.value,
			house_address: feedback.house_address.value,
			price_monthly: feedback.price_monthly.value,
			publisher_phone: feedback.publisher_phone,			
			publisher_uid: feedback.publisher_uid,								
			images: feedback.files
			
		})) 
	}, false)
	feedback.send = function(content) {
		feedback.uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
//			plus.nativeUI.closeWaiting()
			console.log("upload cb:"+upload.responseText);
			var data = JSON.parse(upload.responseText);
			if(status==200 && data.meta.code === 200){				
				//上传成功，重置表单
				console.log("upload success");
				mui.alert('上传房源信息成功',"确定",function () {
					feedback.clearForm();
					mui.back();
				});													
			}else{	//上传失败			
				console.log("upload fail");
				mui.alert("服务器异常，发布失败","确定",function () {
					feedback.clearForm();
					mui.back();
				});
			}			
		});
		//添加上传数据
		mui.each(content, function(index, element) {
			if (index !== 'images') {  
				console.log("addData:"+index+","+element);
//				console.log(index);
				feedback.uploader.addData(index, element)
			} 
		}); 
				
		//添加上传文件
		mui.each(feedback.files, function(index, element) {
			var f = feedback.files[index];
			console.log("addFile:"+JSON.stringify(f));
						
			feedback.uploader.addFile(f.path, {
				key: f.name				
			});
		});
				
		//开始上传任务
		feedback.uploader.start();				
	};
		
})();
