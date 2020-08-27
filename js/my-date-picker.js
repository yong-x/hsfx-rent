
function bindingDataPicker(classname,_mui,refreshContainerId){
	var btns = _mui(classname);
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {							
			var _self = this;			 
			 if(refreshContainerId){
				mui(refreshContainerId).pullRefresh().setStopped(true); //时间选择器被显示时暂时禁止刷新容器滚动 ，禁止刷新容器下拉刷新
			 }			
			if(_self.picker) {							
				_self.picker.show(function (rs) {								
					btn.value=rs.text								
					_self.picker.dispose();
					_self.picker = null;
					//移除弹出层表单遮罩
					//mui("#popover")[0].classList.remove('mui-backdrop');
				});
			} else {
		
				var options={	//时间选择器对象设置
								"type":"date",
								"beginYear":2018,
								"endYear":new Date().getFullYear()
							}								
				/*
				 * 首次显示时实例化组件								
				 */
				_self.picker = new _mui.DtPicker(options);							
				_self.picker.show(function(rs) {						
					btn.value= rs.text;							
					/* 
					 * 返回 false 可以阻止选择框的关闭
					 * return false;
					 */
					/*
					 * 释放组件资源，释放后将将不能再操作组件
					 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
					 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
					 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
					 */
					_self.picker.dispose();
					_self.picker = null;								
				});							
			}
			_self.picker.hide = function() {  //重写hide方法，开启刷新容器的下拉刷新
			                //在选择器开启的时候会禁止页面滚动，隐藏的时候解开
			                if(refreshContainerId){
								mui(refreshContainerId).pullRefresh().setStopped(false); //时间选择器被隐藏后开启刷新容器滚动，使刷新容器可以下拉刷新 
							}
							
			                //下面这部分就是mui.picker.js的hide方法的源码了
			                var i = this;
			                if(!i.disposed) {
			                    var n = i.ui;
			                    n.picker.classList.remove(mui.className("active")),
			                        n.mask.close(),
			                        document.body.classList.remove(mui.className("dtpicker-active-for-page")),
			                        mui.back = i.__back
			                }
			            }												
															
															
		}, false);
	});	
}
		