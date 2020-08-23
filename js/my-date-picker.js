
function bindingDataPicker(classname,_mui){
	var btns = _mui(classname);
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {
			//给弹出层表单设置遮罩				
			//mui("#popover")[0].classList.add('mui-backdrop');						
			var _self = this;
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
		}, false);
	});	
}
		