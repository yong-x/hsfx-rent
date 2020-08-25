//数据校验
/**
 *{type："类型"，notEmpty:true,regxp: reg,MaxLength: number,MinLength number,validatessage: '错误提示信息'}
 * 校验类型 type：phone(手机号)/mail(邮箱)/mount(整数)/money(金额)/passwd(密码)/reg(正则验证)/notNull(不能为空) 必填
 * 是否可为空 Emptable: true(true可为空，false不能为空；默认为false)
 * 正则匹配 regexp( 内容与该正则进行验证,type需要为reg,否则无效 validatessage 错误提示信息 )  type为reg时必填
 * 失败提示内容validatessage: String type为reg/notNull时必填
 * 例子：{type:'phone',notEmpty:true}
 * @constructor
 */

 const validate ={}
 //全体校验方法
 validate.TestAll = function(){
     var InputList = $("[validata]");
     var data = '';
     var result = true;
     for(var i=0;i<InputList.length;i++){
         data = InputList[i].getAttribute("validata");
         if(data){
             data = validate.strToJson(data);
             if(!validate.ifNull(data.type)){
                 var value = InputList[i].value;
                 if(!validate.TestByType(data,value)){
                     return false;
                 }
             }else{
                 console.log("type不能为空")
             }
         }
     }
     return result;
 };
 //根据type进行验证
 validate.TestByType = function (data,value) {
     if(data.type == 'phone'){
         if(value){
             return validate.isPhone(value);
         }else{
             return validate.isEmpty('',data.Emptable,'手机不能为空')
         }
     }else if(data.type == 'mail'){
         if(value){
             return validate.isMail(value);
         }else{
             return validate.isEmpty('',data.Emptable,'邮箱不能为空')
         }
 
     }else if(data.type == 'passwd'){
         if(value){
             return validate.isPwd(value);
         }else{
             return validate.isEmpty('',data.Emptable,'密码不能为空')
         }
 
     }else if(data.type == 'reg'){
         if(validate.ifNull(data.regex)){
             console.log('参数缺少正则表达式')
             return false;
         }else if(validate.ifNull(data.validatessage)){
             console.log('参数validatessage作为提示信息')
             return false;
         }
         return validate.regTset(value,data.regex,data.validatessage)
 
     }else if(data.type == 'mount'){
         if(value){
             return validate.isNumber(value);
 
         }else{
             return validate.isEmpty('',data.Emptable,'数量不能为空')
         }
     }else if(data.type == 'money'){
         if(value){
             return validate.isMoney(value);
         }else{
             return validate.isEmpty('',data.Emptable,'金额不能为空')
         }
     }else if(data.type == 'notNull'){
         return validate.isEmpty(value,data.Emptable,data.validatessage)
     }
 }
 //正则验证
 validate.regTset = function (o,regex,validatessage) {
     var reg = regex;
     if(o){
         if(!reg.test(o)) {
             return false;
         }
     }else{
         return validate.isEmpty('',false,validatessage);
     }
 
     return true;
 }
 //密码校验
 validate.isPwd = function (o) {
     return validate.regTset(o,/^[0-9a-zA-Z]+$/,'密码格式错误');
 }
 //手机号校验
 validate.isPhone = function (o) {
       var phone_reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
     var phone_reg = /^(1+\d{10})$/;
     return validate.regTset(o,phone_reg,'请输入有效的手机号码');
 }
 //邮箱校验
 validate.isMail = function (o) {
     var mail_reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
     return validate.regTset(o,mail_reg,'请输入有效的邮箱');
 }
 //金额校验
 validate.isMoney = function (o) {
     var money_reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
     return validate.regTset(o,money_reg,'请输入有效的金额');
 }
 //数量校验
 validate.isNumber = function (o) {
     var number_reg = /^[1-9]\d*$/;
     return validate.regTset(o,number_reg,'请输入正确的数量');
 }
 //是否允许为空 允许为空 返回true 不允许为空 且为空，返回false 打印错误信息
 validate.isEmpty = function(o,emptable,validatessage) {
     if(emptable){
         return true;
     }else{
         if(o == undefined || o == "" || o == null){               
             return false;
         }
         return true;
     }
 
 }
 //是否为null
 validate.ifNull = function (o) {
     return o == undefined || o == "" || o == null
 }
 //string转json
 validate.strToJson = function (str){
     var json = eval('(' + str + ')');
     return json;
 }
