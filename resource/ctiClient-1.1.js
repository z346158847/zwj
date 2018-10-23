    /**
	 * 一些基本配置，如服务器地址、座席信息、使用的外线号码
	 */
	var websocketUrl = ''//呼叫中心服务器websocket请求地址
	var agentno = '';//座席号码
	var password = '';//座席密码
	var exten = '';//座席分机
	var pstnnumber = '';//外线号码
	var popupUrl = '';//来电弹屏地址
	
    function Map(){
		this.container = new Object();
	}
	
	Map.prototype.put = function(key, value){
		this.container[key] = value;
	}

	Map.prototype.get = function(key){
		return this.container[key];
	}
	
    var websocket = null;//websocket对象
    var hasResponse = false;//是否响应
    var signin = false;//是否登录
	var method = "";//请求类型
	var agentstatus = "0";//座席状态
	var callee = "";//被叫号码
	var timeoutSec = 30;//心跳检测时间（秒）
	var heartbeatId=-1;//心跳事件ID
	var changeStatusId=-1;//统计座席状态时间事件ID
	var loseHeartbeat=0;//心跳丢包次数
	var agentGroupStr='[{"id":1,"parent":0,"name":"座席组","open":false,"isParent":true,"busid":"-1"}';//座席组信息
	var queueStr=',{"id":2,"parent":0,"name":"队列","open":false,"isParent":true,"busid":"-1"}';//队列信息
	var monitorAgents="";//监听座席列表
	var selectAgent="";//当前选中座席
	var roleAgentGroupNum="";//当前座席可以管理的座席组
	var roleQueueNum="";//当前座席可以管理的队列
	var statusMap = new Map();//座席状态MAP
	statusMap.put("-1", "离线");
	statusMap.put("0","空闲");
	statusMap.put("1","振铃");
	statusMap.put("2","通话");
	statusMap.put("3","保持");
	statusMap.put("4","后处理");
	statusMap.put("5","被占用");
	statusMap.put("6","忙碌");
	statusMap.put("7","离开");
	statusMap.put("8","仅呼出");
  	
  	//设置工具栏启用状态
  	function setToolbarEnabled(allStatusFlag,calloutInternalFlag,calloutExternalFlag,hangUpFlag,holdFlag,unHoldFlag,transferFlag,threewayFlag,evaluateFlag,monitorFlag){
  		if(allStatusFlag){
  			$('#allStatus').menubutton("enable");
  		}else{
  			$('#allStatus').menubutton("disable");
  		}
  		if(calloutInternalFlag){
  			$('#calloutInternal').linkbutton("enable");
  		}else{
  			$('#calloutInternal').linkbutton("disable");
  		}
  		if(calloutExternalFlag){
  			$('#calloutExternal').linkbutton("enable");
  		}else{
  			$('#calloutExternal').linkbutton("disable");
  		}
  		if(hangUpFlag){
  			$('#hangUp').linkbutton("enable");
  		}else{
  			$('#hangUp').linkbutton("disable");
  		}
  		if(holdFlag){
  			$('#hold').linkbutton("enable");
  		}else{
  			$('#hold').linkbutton("disable");
  		}
  		if(unHoldFlag){
  			$('#unHold').linkbutton("enable");
  		}else{
  			$('#unHold').linkbutton("disable");
  		}
  		if(transferFlag){
  			$('#transfer').linkbutton("enable");
  		}else{
  			$('#transfer').linkbutton("disable");
  		}
  		if(threewayFlag){
  			$('#threeway').linkbutton("enable");
  		}else{
  			$('#threeway').linkbutton("disable");
  		}
  		if(evaluateFlag){
  			$('#evaluate').linkbutton("enable");
  		}else{
  			$('#evaluate').linkbutton("disable");
  		}
  		if(monitorFlag){
  			$('#monitor').linkbutton("enable");
  		}else{
  			$('#monitor').linkbutton("disable");
  		}
  	}
  	
  	//设置监控栏座席状态
  	function setMonitorbarStatus(agentNum,state){
  		if($("#tdstatus_"+agentNum).length>0){
  			$("#tdstatus_"+agentNum).html(statusMap.get(state));
  			if(state=="-1"){//离线
  				$("#tdacttime_"+agentNum).val(-1);
  				if(selectAgent==agentNum && agentNum!=agentno){
	  				$("#eavesdrop").attr('disabled','');
	  				$("#whisper").attr('disabled','');
	  				$("#bargein").attr('disabled','');
	  				$("#forceHangup").attr('disabled','');
	  				$("#forceBusy").attr('disabled','');
	  				$("#forceIdle").attr('disabled','');
	  				$("#forceOffline").attr('disabled','');
  				}
  			}else if(state=="0"){//空闲
  				$("#tdacttime_"+agentNum).val(0);
  				if(selectAgent==agentNum && agentNum!=agentno){
	  				$("#eavesdrop").attr('disabled','');
	  				$("#whisper").attr('disabled','');
	  				$("#bargein").attr('disabled','');
	  				$("#forceHangup").attr('disabled','');
	  				$("#forceBusy").removeAttr('disabled');
	  				$("#forceIdle").attr('disabled','');
	  				$("#forceOffline").removeAttr('disabled');
  				}
  			}else if(state=="2"){//通话中
  				$("#tdacttime_"+agentNum).val(0);
  				if(selectAgent==agentNum && agentNum!=agentno){
	  				$("#eavesdrop").removeAttr('disabled');
	  				$("#whisper").removeAttr('disabled');
	  				$("#bargein").removeAttr('disabled');
	  				$("#forceHangup").removeAttr('disabled');
	  				$("#forceBusy").attr('disabled','');
	  				$("#forceIdle").attr('disabled','');
	  				$("#forceOffline").attr('disabled','');
  				}
  			}else if(state=="6"){//忙碌
  				$("#tdacttime_"+agentNum).val(0);
  				if(selectAgent==agentNum && agentNum!=agentno){
	  				$("#eavesdrop").attr('disabled','');
	  				$("#whisper").attr('disabled','');
	  				$("#bargein").attr('disabled','');
	  				$("#forceHangup").attr('disabled','');
	  				$("#forceBusy").attr('disabled','');
	  				$("#forceIdle").removeAttr('disabled');
	  				$("#forceOffline").removeAttr('disabled');
  				}
  			}else{//其它
  				$("#tdacttime_"+agentNum).val(0);
  				if(selectAgent==agentNum && agentNum!=agentno){
	  				$("#eavesdrop").attr('disabled','');
	  				$("#whisper").attr('disabled','');
	  				$("#bargein").attr('disabled','');
	  				$("#forceHangup").attr('disabled','');
	  				$("#forceBusy").attr('disabled','');
	  				$("#forceIdle").attr('disabled','');
	  				$("#forceOffline").attr('disabled','');
  				}
  			}
  		}
  	}
  	
  	//设置监控栏按键启用状态
  	function setMonitorbarEnabled(agentNum){
  		if($("#tdstatus_"+agentNum).length>0){
  			var state=$("#tdstatus_"+agentNum).html();
  			if(agentNum==agentno){//本身座席不能操作
  				$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").attr('disabled','');
	  		}else if(state==statusMap.get("-1")){//离线
  				$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").attr('disabled','');
  			}else if(state==statusMap.get("0")){//空闲
	  			$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").removeAttr('disabled');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").removeAttr('disabled');
  			}else if(state==statusMap.get("2")){//通话中
	  			$("#eavesdrop").removeAttr('disabled');
	  			$("#whisper").removeAttr('disabled');
	  			$("#bargein").removeAttr('disabled');
	  			$("#forceHangup").removeAttr('disabled');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").attr('disabled','');
  			}else if(state==statusMap.get("6")){//忙碌
	  			$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").removeAttr('disabled');
	  			$("#forceOffline").removeAttr('disabled');
  			}else{//其它
	  			$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").attr('disabled','');
  			}
  		}else{
  			if($("#eavesdrop").length>0){
  				$("#eavesdrop").attr('disabled','');
	  			$("#whisper").attr('disabled','');
	  			$("#bargein").attr('disabled','');
	  			$("#forceHangup").attr('disabled','');
	  			$("#forceBusy").attr('disabled','');
	  			$("#forceIdle").attr('disabled','');
	  			$("#forceOffline").attr('disabled','');
  			}
  		}
  	}
  		
  	//设置指定按键启用状态
  	function setSingleButtonEnabled(buttonName,flag){
  		if($("#"+buttonName).length>0){
  			if(flag=='diabled'){
  				$("#"+buttonName).attr('disabled','');
  				if(buttonName!='eavesdrop')$("#eavesdrop").removeAttr('disabled');
  				if(buttonName!='whisper')$("#whisper").removeAttr('disabled');
  				if(buttonName!='bargein')$("#bargein").removeAttr('disabled');
  				if(buttonName!='forceHangup')$("#forceHangup").removeAttr('disabled');
  			}else{
  				$("#"+buttonName).removeAttr('disabled');
  			}
  		}
  	}
  	
  	//根据座席状态设置工具栏功能键启用状态
  	function setToolbarByStatus(state){
							var seatState = $('#seat_state');
							if(state=="-1"){
								seatState.text("离线");
								setToolbarEnabled(false,false,false,false,false,false,false,false,false,false);
							}else if(state=="0"){
								seatState.text("空闲");
								setToolbarEnabled(true,true,true,false,false,false,false,false,false,true);
							}else if(state=="1"){
								seatState.text("振铃");
								setToolbarEnabled(false,false,false,false,false,false,false,false,false,true);
							}else if(state=="2"){
								seatState.text("通话");
								setToolbarEnabled(false,false,false,true,true,false,true,true,true,true);
							}else if(state=="3"){
								seatState.text("保持");
								setToolbarEnabled(false,false,false,false,false,true,false,false,false,true);
							}else if(state=="4"){
								seatState.text("后处理");
								setToolbarEnabled(true,false,false,false,false,false,false,false,false,true);
							}else if(state=="5"){
								seatState.text("被占用");
								setToolbarEnabled(false,false,false,false,false,false,false,false,false,true);
							}else if(state=="6"){
								seatState.text("忙碌");
								setToolbarEnabled(true,false,false,false,false,false,false,false,false,true);
							}else if(state=="7"){
								seatState.text("离开");
								setToolbarEnabled(true,false,false,false,false,false,false,false,false,true);
							}else if(state=="8"){
								seatState.text("仅呼出");
								setToolbarEnabled(true,false,false,false,false,false,false,false,false,true);
							}
  	}
  	
  	function setMessageInnerHTML(innerHTML){
  		//alert(innerHTML);
  	}
  	
  	function closeWebSocket(){
  		websocket.close();
  	}
  	
  	function send(){
  		var message = "{'method':'"+method+"','agentno':'"+agentno+"','password':'"+password+"','exten':'"+exten+"','agentstatus':'"+agentstatus+"','pstnnumber':'"+pstnnumber+"','callee':'"+callee+"'}";
  		websocket.send(message);
  	}
    
    //签入或签出    
    function signInOrOut(){
		if(heartbeatId>=0){
			clearInterval(heartbeatId);
		}
		if(!signin){
			method = "signout";
			send();
			hasResponse = false;
    		displayLoadingMessage();
			setTimeout('delaySignin()',1000);
			setTimeout('timeout()',8000);
			return;
		}

    	hasResponse = false;
    	displayLoadingMessage();
    	method = "signin";
    	if(signin){
    		method = "signout";
    	}else{
			agentstatus = "0";//签入时默认为空闲
		}
  		send();
  		setTimeout('timeout()',8000);
	}
	
	//延迟签入
	function delaySignin(){
		method = "signin";
		agentstatus = "0";//签入时默认为空闲
  		send();
	}


	
	//请求超时
	function timeout(){
		if(!hasResponse){
			hideLoadingMessage();
			loseHeartbeat = 0;
			var seatState = $('#seat_state');
			var signInOrOut = $('#signInOrOut');
			var signInOrOutHtml = signInOrOut.html();
			signin = false;
			signInOrOut.html(signInOrOutHtml.replace("签出","签入"));
			if(heartbeatId>=0){
				clearInterval(heartbeatId);
			}
			seatState.text("未签入");
			setToolbarEnabled(false,false,false,false,false,false,false,false,false,false);
  			//websocket.send(message);
			alert("与服务器连接中断，请重新签入");
		}	
	}
	
	//心跳检测
	function heartbeat(){
		if(loseHeartbeat>1){
			loseHeartbeat = 0;
			var seatState = $('#seat_state');
			var signInOrOut = $('#signInOrOut');
			var signInOrOutHtml = signInOrOut.html();
			signin = false;
			signInOrOut.html(signInOrOutHtml.replace("签出","签入"));
			if(heartbeatId>=0){
				clearInterval(heartbeatId);
			}
			seatState.text("未签入");
			setToolbarEnabled(false,false,false,false,false,false,false,false,false,false);
  			//websocket.send(message);
			alert("与服务器连接中断，请重新签入");
		}else{
			loseHeartbeat = loseHeartbeat+1;
			var message = "{'method':'heartbeat','agentno':'"+agentno+"'}";
	  		websocket.send(message);
  		}
	}	
	
	function changeStatusInterval(){
		if(monitorAgents!=''){
			$.each(monitorAgents.split(","), function(i,mAgent){  
				if($("#tdacttime_"+mAgent).length>0){
					var changeTime = $("#tdacttime_"+mAgent).val();
					if(Number(changeTime)>=0){
						changeTime = Number(changeTime)+1;
						$("#tdtime_"+mAgent).html(formatChangeTime(Number(changeTime)));
						$("#tdacttime_"+mAgent).val(changeTime)
					}else{
						$("#tdtime_"+mAgent).html("");
					}
				}
  			});  
		}
	}
	
	//响应事件 
	function onEvent(eventType,state,methodType,code,jsonStr){
		var seatState = $('#seat_state');
		var signInOrOut = $('#signInOrOut');
		var signInOrOutHtml = signInOrOut.html();
		var eventAgentNo = jsonStr.agentno;
		if(eventType=='event'){
			if(methodType=='signin'){
						if(code=='0'){
		  					signin = true;
							signInOrOut.html(signInOrOutHtml.replace("签入","签出"));
							agentstatus="1";
							method="setAcsType";//通话结束后座席状态默认空闲
							send();
							if(heartbeatId>=0){
								clearInterval(heartbeatId);
							}
							heartbeatId = setInterval("heartbeat()",timeoutSec*1000);
							
							method="getDefinedRoleRights";//获取座席权限
							send();
							alert("签入成功");
		  				}else if(code=='-53'){
							alert("用户名或密码错误，签入失败");
						}else{
		  					alert("签入失败[ErrorCode:"+code+"]");
		  				}
			}else if(methodType=='disconnect'){
				hasResponse = true;
	  			hideLoadingMessage();
	  			if(methodType=='disconnect'){//连接断开
	  				signin = false;
					signInOrOut.html(signInOrOutHtml.replace("签出","签入"));
					seatState.text("未签入");
					if(heartbeatId>=0){
						clearInterval(heartbeatId);
					}
					if(changeStatusId>=0){
						clearInterval(changeStatusId);
					}
					setToolbarEnabled(false,false,false,false,false,false,false,false,false,false);
	  			}
			}else if(methodType=='agent_status_change'){//座席状态被改变
				if(eventAgentNo==agentno){
					setToolbarByStatus(state);
				}
				if($("#doctree").length>0){
					setMonitorbarStatus(eventAgentNo,state);
				}
			}else if(methodType=="common_callin_bridge_ring"){//呼入弹屏
				if(eventAgentNo==agentno){
					var customerNum = jsonStr.customerNum;
					var url=popupUrl+"?phone="+customerNum+"&agentno="+eventAgentNo;
					window.open (url,'来电弹屏') 
				}
			}else if(methodType=="manual_callout_agent_ring"){//呼出弹屏
				if(eventAgentNo==agentno){
					var customerNum = jsonStr.customerNum;
					var url=popupUrl+"?phone="+customerNum+"&agentno="+eventAgentNo;
					window.open (url,'呼出弹屏') 
				}
			} 
		}else if(eventType=='response'){
			if(methodType=='signin'){
					hasResponse = true;
					hideLoadingMessage();
					if(code=='-6'){
		  				alert("请不要重复签入");
		  			}else if(code=='-11'){
		  				alert("分机不在线，签入失败");
		  			}else if(code=='-12'){
		  				alert("分机已被其他座席绑定，签入失败");
		  			}else if(code!='0'){
		  				alert("签入失败[ErrorCode:"+code+"]");
		  			}
	  		}else if(methodType=='signout'){
					hasResponse = true;
					hideLoadingMessage();
					if(code=='0'){
	  					signin = false;
						signInOrOut.html(signInOrOutHtml.replace("签出","签入"));
						if(heartbeatId>=0){
							clearInterval(heartbeatId);
						}
						alert("签出成功");
						seatState.text("未签入");
						setToolbarEnabled(false,false,false,false,false,false,false,false,false,false);
	  				}else{
	  					alert("签出失败");
	  				}
	  		}else if(methodType=='manual_callout'){//外呼
				if(code=='-19' || code=='-22'){
					alert("接入号不正确，呼叫失败");
				}else if(code=='-24' || code=='-31'){
					alert("座席非空闲状态，呼叫失败");
				}else if(code!='0'){
					alert("呼叫失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='internal_call'){//内呼
				if(code=='-30'){
					alert("被叫座席不在线，呼叫失败");
				}else if(code=='-24' || code=='-31'){
					alert("座席非空闲状态，呼叫失败");
				}else if(code!='0'){
					alert("呼叫失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='blind_transfer'){//转接座席
				if(code=='-30'){
					alert("被叫座席不在线，呼叫失败");
				}else if(code=='-24' || code=='-31' || code=='-32'){
					alert("座席非空闲状态，呼叫失败");
				}else if(code!='0'){
					alert("呼叫失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='threeway'){//三方
				if(code=='-30'){
					alert("被叫座席不在线，呼叫失败");
				}else if(code=='-24' || code=='-31' || code=='-32'){
					alert("座席非空闲状态，呼叫失败");
				}else if(code!='0'){
					alert("呼叫失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='eavesdrop'){//监听
				if(code=='0'){
					setSingleButtonEnabled('eavesdrop','diabled');
				}else{
					alert("监听失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='whisper'){//密语
				if(code=='0'){
					setSingleButtonEnabled('whisper','diabled');
				}else{
					alert("密语失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='bargein'){//强插
				if(code=='0'){
					setSingleButtonEnabled('bargein','diabled');
				}else{
					alert("强插失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='force_hangup'){//强拆
				if(code=='0'){
					setSingleButtonEnabled('forceHangup','diabled');
				}else{
					alert("强拆失败[ErrorCode:"+code+"]");
				}
			}else if(methodType=='heartbeat'){//心跳检测
				if(code=='0'){
					loseHeartbeat = 0;
				}
			}
		}
	}
	
	//修改座席状态
	function changeStatus(state){
		agentstatus = state;
		method="changeStatus";
		send();
	}
	
	
	//内呼
	function calloutInternal(){	
		var dialog = art.dialog({
		title: '呼出内线',
	    content: '<p>座席号码：'+'<input id="demo-labs-input" style="width:15em; padding:4px" /></p>',
	    fixed: true,
	    id: 'Fm7',
	    icon: 'succeed',
	    //time: 2,
	    okVal: '确定',
	    ok: function () {
	    	var input = document.getElementById('demo-labs-input');
	    	var reNum =/^[0-9]+$/;
	    	if (!reNum.test(input.value)) {
	            input.select();
	            input.focus();
	            alert("请输入有效的座席号码");
	            return false;
	        } else {
				var message = "{'method':'internalCall','agentno':'"+agentno+"','callee':'"+input.value+"'}";
	  			websocket.send(message);
	        };
	    },
	    cancel: true
		});
	}
	
	//外呼
	function calloutExternal(){	
		var dialog = art.dialog({
		title: '呼出外线',
	    content: '<p>电话号码：'+'<input id="demo-labs-input" style="width:15em; padding:4px" /></p>',
	    fixed: true,
	    id: 'Fm7',
	    icon: 'succeed',
	    //time: 2,
	    okVal: '确定',
	    ok: function () {
	    	var input = document.getElementById('demo-labs-input');
	    	var reNum =/^[0-9]+$/;
	    	if (!reNum.test(input.value)) {
	            input.select();
	            input.focus();
	            alert("请输入有效的电话号码");
	            return false;
	        } else {
				var message = "{'method':'manualCallout','agentno':'"+agentno+"','pstnnumber':'"+pstnnumber+"','callee':'"+input.value+"'}";
	  			websocket.send(message);
	        };
	    },
	    cancel: true
		});
	}
	
	//挂断
	function hangUp(){
		method="hangup";
		send();
	}
	
	//评分
	function customerEvaluate(){
		method="evaluate";
		send();
	}
	
	//保持
	function hold(){
		method="hold";
		send();
	}
	
	//解除保持
	function unHold(){
		method="unhold";
		send();
	}
	
	//转接座席
	function transfer(){	
		var dialog = art.dialog({
		title: '转接座席',
	    content: '<p>座席号码：'+'<input id="demo-labs-input" style="width:15em; padding:4px" /></p>',
	    fixed: true,
	    id: 'Fm7',
	    icon: 'succeed',
	    //time: 2,
	    okVal: '确定',
	    ok: function () {
	    	var input = document.getElementById('demo-labs-input');
	    	var reNum =/^[0-9]+$/;
	    	if (!reNum.test(input.value)) {
	            input.select();
	            input.focus();
	            alert("请输入有效的座席号码");
	            return false;
	        } else {
				var message = "{'method':'blindTransfer','agentno':'"+agentno+"','callee':'"+input.value+"'}";
	  			websocket.send(message);
	        };
	    },
	    cancel: true
		});
	}
	
	//三方
	function threeway(){	
		var dialog = art.dialog({
		title: '三方',
	    content: '<p>座席号码：'+'<input id="demo-labs-input" style="width:15em; padding:4px" /></p>',
	    fixed: true,
	    id: 'Fm7',
	    icon: 'succeed',
	    //time: 2,
	    okVal: '确定',
	    ok: function () {
	    	var input = document.getElementById('demo-labs-input');
	    	var reNum =/^[0-9]+$/;
	    	if (!reNum.test(input.value)) {
	            input.select();
	            input.focus();
	            alert("请输入有效的座席号码");
	            return false;
	        } else {
				var message = "{'method':'threeway','agentno':'"+agentno+"','callee':'"+input.value+"'}";
	  			websocket.send(message);
	        };
	    },
	    cancel: true
		});
	}