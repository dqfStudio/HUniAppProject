import io from '@/js_sdk/hyoga-uni-socket_io/uni-socket.io.js';
// import live from './liveSocket.js'

// var config = {
//     dev: "http://chat-room-dev.leihuozb.com",
//     ol: "https://chat-room.leihuozb.com",
//     local: 'http://154.204.42.66:19977',
//     shut: "禁言",
//     kick: "踢出",
//     black: "拉黑",
//     method: "get",
// }

var socket;
var room = {
	/**
	 *  初始化环境
	 */
	initEnv: function (data) {	
		socket = io(data, {
		  query: {},
		  transports: [ 'websocket' ],
		  timeout: 5000,
		});
	},
	
	/**
	 *  连接
	 */
	connect: function (data) {
		socket.on('connect', () => {
		
		    let connData = {
				nickname: data.nickname,
				uid: data.uid,
				token: data.token,
				roomnum: data.roomnum,
				equipment: data.equipment,
				stream: data.stream
			};
		  
			socket.emit('conn', connData);
		});
	},
	
	/**
	 *  监听
	 */
	listeners: function () {
		
		socket.on('disconnect', (msg) => {
			console.log('disconnect', msg);
		});
		socket.on('broadcast', (msg) => {
			console.log('broadcast', msg);
		});
		socket.on('heartbeat', (msg) => {
			console.log('heartbeat', msg);
			socket.emit("heartbeat", "heartbeat");
		});
		socket.on('error', (msg) => {
			console.log('error', msg);
		});
		socket.on('conn', (msg) => {
			console.log('conn', msg);
			room.action.zombie();
		});
		
		socket.on('broadcastingListen', (data) => {
			console.log('broadcastingListen', data);
			let arrayData = JSON.stringify(data);
			
			let subArrayData = arrayData[0];
			if (subArrayData[0] == "stopplay") {
				// [weakself.socketDelegate roomCloseByAdmin];
				return;
			}
			
			for (let path in subArrayData) {
				let jsonDict = path;
				let tmpArray = jsonDict.msg;
				let msg = tmpArray[0];
				let retcode = jsonDict.retcode;
				
				if (retcode == 409002) {
				    uni.showToast({
				    	title:"你已被禁言",
				    	icon:'none',
				    	duration:2000
				    })
				    return;
				}
				
				let method = msg._method_;
				room.getMessage(method, msg);
			}
		});
	},
	getMessage: function (method, msg) {
		
		//僵尸粉
	    if (method == "requestFans") {
	        let ct = msg.ct;
			let data = ct.data;
	        if (data.code == 0) {
	            let info = data.info;
				let tmpArray = info.list;
				let list = tmpArray[0];
	            // [self.socketDelegate addZombieByArray:list];
	        }
	    }
	    //会话消息
	    if (method == "SendMsg") {
	        let msgtype = msg.msgtype;
	        if (msgtype == "2") {
	            let ct = '';
	            //点亮
	            if (msg.heart != nil) {
	                let lightColor = msg.heart;
	                let light = "light";
	                let titleColor = light+lightColor;
	                ct = msg.ct;
	                let uname = msg.uname;
	                let levell = msg.level;
	                let uid = msg.uid;
	                let vip_type = msg.vip_type;
	                let liangname = msg.liangname;
	                let usertype = msg.usertype;
	                let guardType = msg.guard_type;
	
					let chat = {
						userName: uname,
						contentChat: ct,
						levelI: level,
						id: uid,
						titleColor: titleColor,
						vip_type: vip_type,
						liangname: liangname,
						usertype: usertype,
						guard_type: guardType
					}
	                // [self.socketDelegate light:chat];
	            }
	            else{
	                let titleColor = "0";
	                ct = msg.ct;
	                let uname = msg.uname;
	                let level = msg.level;
	                let uid = msg.uid;
	                let vip_type = msg.vip_type;
	                let liangname = msg.liangname;
	                let usertype = msg.usertype;
	                let isAnchor = msg.isAnchor;
	                let guardType = msg.guard_type;
					
					let chat = {
						userName: uname,
						contentChat: ct,
						levelI: level,
						id: uid,
						titleColor: titleColor,
						vip_type: vip_type,
						liangname: liangname,
						usertype: usertype,
						isAnchor: isAnchor,
						guard_type: guardType
					}
	                // [self.socketDelegate messageListen:chat];
	            }
	        }
	        //用户离开进入
	        else if (msgtype == "0") {
	            let action = msg.action;
	            //用户离开
	            if (action == "1") {
	                //NSLog(@"用户离开，%@",msg);
	                // [self.socketDelegate UserLeave:msg];
	            }
	            //用户进入
	            if (action == "0") {
	                // [self.socketDelegate UserAccess:msg];
	            }
	        }
	        //直播关闭
	        if (msgtype == "1") {
	            let action = msg.action;
	            if (action == "18") {
	                // NSLog(@"直播关闭");
	                // [self.socketDelegate LiveOff];
	            }
	        }
	        if (msgtype == "26") {
	            
	        }
	        //发红包
	        // if ([msgtype isEqual:@"255"]) {
	        //     NSString *action = [msg valueForKey:@"action"];
	        //     //
	        //     if ([action isEqual:@"0"]) {
	        //         [self.socketDelegate showRedbag:msg];
	        //     }
	        // }
	
	    }
	    //增加映票
	    // else if ([method isEqual:@"updateVotes"]){
	    //     NSString *msgtype = [msg valueForKey:@"msgtype"];
	    //     if ([msgtype isEqual:@"26"]) {
	    //         //限制进房间的时候自己不增加
	    //         NSString *uid = minstr([msg valueForKey:@"uid"]);
	    //         if (![uid isEqual:[HConfig getOwnID]]) {
	    //             [self.socketDelegate addvotesdelegate:[msg valueForKey:@"votes"]];
	    //         }
	    //     }
	    // }
	    //房间类型切换
	    else if (method == "changeLive") {
	        // [self.socketDelegate changeLive:[NSString stringWithFormat:@"%@",[msg valueForKey:@"type_val"]]];
	    }
	    //点亮
	    else if (method == "light") {
	        let msgtype = msg.msgtype;
	        if (msgtype == "0") {
	            let action = msg.action ;
	            //点亮
	            if (action == "2") {
	                // [self.socketDelegate sendLight];
	            }
	        }
	    }
	    //设置管理员
	    else if (method == "SystemNot" || method == "ShutUpUser") {
	        let msgtype = msg.msgtype;
	        let action = msg.action;
	        let touid = msg.touid;
	        if(msgtype == "4" && action == "13") {
	            //设置取消管理员
	            // if ([touid isEqual:[HConfig getOwnID]]) {
	            //     [self alertShowMsg:minstr([msg valueForKey:@"ct"]) andTitle:YZMsg(@"提示")];
	            // }
	        }
	        else if (msgtype == "4" && action == "1") {
	            //禁言
	            // if ([touid isEqual:[HConfig getOwnID]]) {
	            //     [self alertShowMsg:minstr([msg valueForKey:@"ct"]) andTitle:YZMsg(@"提示")];
	            // }
	        }
	        // [self.socketDelegate setSystemNot:msg];
	    }    
		else if (method == "setAdmin") {
	        let ct = msg.ct;
	        if (ct) {
	            // [self.socketDelegate setAdmin:msg];
	        }
	    }
	    // else if ([method isEqual:@"shopGoodsLiveFloat"]){
	    //     [self.socketDelegate showLiveGooodTips:msg];
	    // }
	    // else if ([method isEqual:@"Sendplatgift"]){
	    //     //全站礼物
	    //     [self.socketDelegate sendAllStationsGift:msg];
	    // }
	    //送礼物
	//     else if ([method isEqual:@"SendGift"]) {
	// //        NSString *titleColor = @"2";
	//         if ([minstr([msg valueForKey:@"ifpk"]) isEqual:@"1"]) {
	//             [self.socketDelegate changePkProgressViewValue:msg];
	//             if (![minstr([msg valueForKey:@"roomnum"]) isEqual:minstr([_playDoc valueForKey:@"uid"])]) {
	//                 return;
	//             }
	//         }
	
	//         NSString *haohualiwu =  [NSString stringWithFormat:@"%@",[msg valueForKey:@"evensend"]];
	//         NSDictionary *ct = [msg valueForKey:@"ct"];
	        
	//         NSDictionary *GiftInfo = @{@"uid":[msg valueForKey:@"uid"],
	//                                    @"nicename":[msg valueForKey:@"uname"],
	//                                    @"giftname":[ct valueForKey:@"giftname"],
	//                                    @"gifticon":[ct valueForKey:@"gifticon"],
	//                                    @"giftcount":[ct valueForKey:@"giftcount"],
	//                                    @"giftid":[ct valueForKey:@"giftid"],
	//                                    @"level":[msg valueForKey:@"level"],
	//                                    @"avatar":[msg valueForKey:@"uhead"],
	//                                    @"type":[ct valueForKey:@"type"],
	//                                    @"swf":minstr([ct valueForKey:@"swf"]),
	//                                    @"swftime":minstr([ct valueForKey:@"swftime"]),
	//                                    @"swftype":minstr([ct valueForKey:@"swftype"]),
	//                                    @"isluck":minstr([ct valueForKey:@"isluck"]),
	//                                    @"lucktimes":minstr([ct valueForKey:@"lucktimes"]),
	//                                    @"mark":minstr([ct valueForKey:@"mark"]),
	//                                    @"livename":minstr([msg valueForKey:@"livename"]),
	//                                    @"isplatgift":minstr([ct valueForKey:@"isplatgift"]),
	//                                    @"paintedPath":[msg valueForKey:@"paintedPath"],
	//                                    @"paintedHeight":minstr([msg valueForKey:@"paintedHeight"]),
	//                                    @"paintedWidth":minstr([msg valueForKey:@"paintedWidth"])
	
	//                                    };
	//             [self.socketDelegate sendGift:nil andLiansong:haohualiwu andTotalCoin:minstr([ct valueForKey:@"votestotal"]) andGiftInfo:GiftInfo andCt:ct];
	//     }    
	    // else if ([method isEqual:@"luckWin"]) {//幸运礼物
	    //     [self.socketDelegate showAllLuckygift:msg];
	    //     NSLog(@"幸运礼物%@",msg);
	    // }
	    // else if ([method isEqual:@"jackpotWin"]) {//奖池中奖
	    //     [self.socketDelegate WinningPrize:msg];
	    //     NSLog(@"奖池中奖%@",msg);
	    // }
	    // else if ([method isEqual:@"jackpotUp"]) {//奖池升级
	    //     [self.socketDelegate JackpotLevelUp:msg];
	    //     NSLog(@"奖池升级%@",msg);
	    // }
	    else if (method == "SendBarrage") {//弹幕
	        // [self.socketDelegate SendBarrage:msg];
	        // NSLog(@"弹幕接受成功%@",msg);
	    }
	    else if (method == "StartEndLive") {//结束直播
	        // [self.socketDelegate StartEndLive];
	    }
	    else if (method == "disconnect") {//断开链接
	        // [self.socketDelegate UserDisconnect:msg];
	    }
	    // else if ([method isEqual:@"goodsLiveShow"]){//直播间商品窗口
	    //     [self.socketDelegate showLiveGoodsWithDic:msg];
	    // }
	    else if (method == "KickUser") {//踢人消息
	        let unamessss = msg.touid;
	        // if([unamessss isEqual:[HConfig getOwnID]] ){
	        //     [self.socketDelegate kickOK];
	        // }
	        let titleColor = "firstlogin";
	        let ct = msg.ct;
	        let uname = "直播间消息";
	        let levell = " ";
	        let ID = " ";
	        let icon = " ";
	        let vip_type = "0";
	        let liangname = "0";
			
			let chat = {
				userName: uname,
				contentChat: ct,
				levelI: levell,
				id: ID,
				titleColor: titleColor,
				avatar: icon,
				vip_type: vip_type,
				liangname: liangname
			}
	        // [self.socketDelegate KickUser:chat];
	    }
	    /*
	     1 有人发送连麦请求
	     2 主播接受连麦
	     3 主播拒绝连麦
	     4 用户推流，发送自己的播流地址
	     5 用户断开连麦
	     6 主播断开连麦
	     7 主播正忙碌
	     8 主播无响应
	     */
	//     else if ([method isEqual:@"ConnectVideo"]){
	//         NSString *action = [NSString stringWithFormat:@"%@",[msg valueForKey:@"action"]];
	//         if ([action isEqual:@"1"]) {
	//             return;
	//         }
	//         if ([action isEqual:@"4"]) {
	//             NSString *uid = [NSString stringWithFormat:@"%@",[msg valueForKey:@"uid"]];
	//             if (![uid isEqual:[HConfig getOwnID]]) {
	//                 //不是连麦用户的其他用户播放连麦用户的流
	//                 [self.socketDelegate playLinkUserUrl:minstr([msg valueForKey:@"playurl"]) andUid:minstr([msg valueForKey:@"uid"])];
	//             }
	//         }
	//         if ([action isEqual:@"5"]){
	//             [self.socketDelegate hostout];
	//             if (![minstr([msg valueForKey:@"uid"]) isEqual:[HConfig getOwnID]]) {
	//                 [MBProgressHUD showError:[NSString stringWithFormat:@"%@%@",minstr([msg valueForKey:@"uname"]),YZMsg(@"已下麦")]];
	//             }
	//         }
	//         if ([action isEqual:@"6"]) {
	//             [self.socketDelegate hostout];
	//             if ([minstr([msg valueForKey:@"touid"]) isEqual:[HConfig getOwnID]]) {
	//                 [MBProgressHUD showError:YZMsg(@"主播已把你下麦")];
	//             }else{
	//                 [MBProgressHUD showError:[NSString stringWithFormat:@"%@%@",minstr([msg valueForKey:@"uname"]),YZMsg(@"已下麦")]];
	//             }
	//         }
	//         NSString *touid = [NSString stringWithFormat:@"%@",[msg valueForKey:@"touid"]];
	//         if ([touid isEqual:[HConfig getOwnID]]) {
	//             if ([action isEqual:@"2"]) {
	//                 //同意连麦
	//                 [self.socketDelegate startConnectvideo];
	//             }
	//             else if ([action isEqual:@"3"]){
	//                 //拒绝连麦
	//                 [MBProgressHUD hideHUD];
	//                 [MBProgressHUD showError:YZMsg(@"主播拒绝了您的连麦请求")];
	//                 [self.socketDelegate enabledlianmaibtn];
	//             }
	            
	//             //主播正忙碌
	//             if ([action isEqual:@"7"]) {
	//                 [MBProgressHUD hideHUD];
	//                 [MBProgressHUD showError:YZMsg(@"主播正忙碌")];
	//                 [self.socketDelegate enabledlianmaibtn];
	//             }
	//             //主播未响应
	//             if ([action isEqual:@"8"]) {
	//                 [MBProgressHUD hideHUD];
	//                 [MBProgressHUD showError:YZMsg(@"当前主播暂时无法接通")];
	//                 [self.socketDelegate enabledlianmaibtn];
	//             }
	//             //主播未响应
	//             if ([action isEqual:@"10"]) {
	//                 [MBProgressHUD hideHUD];
	//                 [MBProgressHUD showError:YZMsg(@"主播未开启连麦功能哦")];
	//                 [self.socketDelegate enabledlianmaibtn];
	//             }
	
	//         }
	        
	//     }
	    // else if ([method isEqual:@"BuyGuard"]){//购买守护
	    //     [self.socketDelegate updateGuardMsg:msg];
	    //     NSDictionary *dic = @{@"ct":[NSString stringWithFormat:@"%@ %@",minstr([msg valueForKey:@"uname"]),YZMsg(@"守护了主播")]};
	    //     [self.socketDelegate setSystemNot:dic];
	    // }
	    // else if ([method isEqual:@"SendRed"]) {//发红包
	    //     NSString *action = [msg valueForKey:@"action"];
	    //     //
	    //     if ([action isEqual:@"0"]) {
	    //         [self.socketDelegate showRedbag:msg];
	    //     }
	    // } 
		else if (method == "LiveConnect"){
	        //1：发起连麦；2；接受连麦；3:拒绝连麦；4：连麦成功通知；5.手动断开连麦;7:对方正忙碌 8:对方无响应
	        let action = msg.action;
	        switch (action) {
	                case 4:
	                    // [self.socketDelegate anchor_agreeLink:msg];
	                break;
	                case 5:
	                    // [self.socketDelegate anchor_stopLink:msg];
	                break;
	            default:
	                break;
	        }
	    }
		// else if ([method isEqual:@"LivePK"]){
	 //        //1：发起PK；2；接受PK；3:拒绝PK；4：PK成功通知；5.;7:对方正忙碌 8:对方无响应 9:PK结果
	 //        int action = [minstr([msg valueForKey:@"action"]) intValue];
	 //        switch (action) {
	 //                case 4:
	 //                [self.socketDelegate showPKView:nil];
	 //                break;
	 //                case 9:
	 //                    [self.socketDelegate showPKResult:msg];
	 //                break;
	                
	 //            default:
	 //                break;
	 //        }
	 //    }
	    //炸金花//收到主播广播准备开始游戏
	    ////收到主播广播准备开始游戏
	    // else if ([method isEqual:@"startGame"] || [method isEqual:@"startLodumaniGame"] || [method isEqual:@"startCattleGame"] ){
	    //     NSString *action = [NSString stringWithFormat:@"%@",[msg valueForKey:@"action"]];
	    //     NSString *msgtype = [NSString stringWithFormat:@"%@",[msg valueForKey:@"msgtype"]];
	    //     if ([action isEqual:@"1"]) {
	    //         //出现游戏界面
	    //         [self.socketDelegate prepGameandMethod:method andMsgtype:msgtype];
	    //     }
	    //     else if ([action isEqual:@"2"]){
	    //         if ([method isEqual:@"startCattleGame"]) {
	    //             NSDictionary *bankdic = [msg valueForKey:@"bankerlist"];
	    //             [self.socketDelegate changeBank:bankdic];
	    //         }
	    //         //开始发牌
	    //         [self.socketDelegate takePoker:[msg valueForKey:@"gameid"] Method:method andMsgtype:msgtype];
	            
	    //     }
	    //     else if ([action isEqual:@"3"]){
	    //         //主播关闭游戏
	    //         [self.socketDelegate stopGame];
	    //     }
	    //     else if ([action isEqual:@"4"]){
	    //         //游戏开始 倒数计时
	    //         NSString *time = [NSString stringWithFormat:@"%@",[msg valueForKey:@"time"]];//游戏时间
	    //         [self.socketDelegate startGame:time andGameID:[msg valueForKey:@"gameid"]];
	    //     }
	    //     else if ([action isEqual:@"5"]){
	    //         //用户投注
	    //         NSString *money = [NSString stringWithFormat:@"%@",[msg valueForKey:@"money"]];
	    //         NSString *type = [NSString stringWithFormat:@"%@",[msg valueForKey:@"type"]];
	    //         [self.socketDelegate getCoin:type andMoney:money];
	    //     }else if ([action isEqual:@"6"]){
	    //         //开奖
	    //         NSArray *ct = [msg valueForKey:@"ct"];
	    //         [self.socketDelegate getResult:ct];
	    //     }
	    // }
	    // else if ([method isEqual:@"startRotationGame"]){
	    //     NSString *action = [NSString stringWithFormat:@"%@",[msg valueForKey:@"action"]];
	    //     if ([action isEqual:@"1"]) {
	    //         //出现游戏界面
	    //         [self.socketDelegate prepRotationGame];
	    //     }
	    //     else if ([action isEqual:@"2"]){
	            
	            
	    //     }
	    //     else if ([action isEqual:@"3"]){
	    //         //主播关闭游戏
	    //         [self.socketDelegate stopRotationGame];
	            
	    //     }
	    //     else if ([action isEqual:@"4"]){
	    //         //游戏开始 倒数计时
	    //         NSString *time = [NSString stringWithFormat:@"%@",[msg valueForKey:@"time"]];//游戏时间
	    //         [self.socketDelegate startRotationGame:time andGameID:[msg valueForKey:@"gameid"]];
	    //     }
	    //     else if ([action isEqual:@"5"]){
	    //         //用户投注
	    //         NSString *money = [NSString stringWithFormat:@"%@",[msg valueForKey:@"money"]];
	    //         NSString *type = [NSString stringWithFormat:@"%@",[msg valueForKey:@"type"]];
	    //         [self.socketDelegate getRotationCoin:type andMoney:money];
	    //     }else if ([action isEqual:@"6"]){
	    //         //开奖
	    //         NSArray *ct = [msg valueForKey:@"ct"];
	    //         [self.socketDelegate getRotationResult:ct];
	    //     }
	    // }
	    //二八贝
	    // else if ([method isEqual:@"startShellGame"]){
	    //     NSString *action = [NSString stringWithFormat:@"%@",[msg valueForKey:@"action"]];
	    //     NSString *msgtype = [NSString stringWithFormat:@"%@",[msg valueForKey:@"msgtype"]];
	    //     if ([action isEqual:@"1"]) {
	    //         //出现游戏界面
	    //         [self.socketDelegate shellprepGameandMethod:method andMsgtype:msgtype];
	    //     }
	    //     else if ([action isEqual:@"2"]){
	    //         //开始发牌
	    //         [self.socketDelegate shelltakePoker:[msg valueForKey:@"gameid"] Method:method andMsgtype:msgtype];
	    //     }
	    //     else if ([action isEqual:@"3"]){
	    //         //主播关闭游戏
	    //         [self.socketDelegate shellstopGame];
	    //     }
	    //     else if ([action isEqual:@"4"]){
	    //         //游戏开始 倒数计时
	    //         NSString *time = [NSString stringWithFormat:@"%@",[msg valueForKey:@"time"]];//游戏时间
	    //         [self.socketDelegate shellstartGame:time andGameID:[msg valueForKey:@"gameid"]];
	    //     }
	    //     else if ([action isEqual:@"5"]){
	    //         //用户投注
	    //         NSString *money = [NSString stringWithFormat:@"%@",[msg valueForKey:@"money"]];
	    //         NSString *type = [NSString stringWithFormat:@"%@",[msg valueForKey:@"type"]];
	    //         [self.socketDelegate shellgetCoin:type andMoney:money];
	    //     }else if ([action isEqual:@"6"]){
	    //         //开奖
	    //         NSArray *ct = [msg valueForKey:@"ct"];
	    //         [self.socketDelegate shellgetResult:ct];
	    //     }
	    // }
	    // else if ([method isEqual:@"shangzhuang"]){
	    //     NSString *action = [NSString stringWithFormat:@"%@",[msg valueForKey:@"action"]];
	    //     //有人上庄
	    //     if ([action isEqual:@"1"]) {
	    //         NSDictionary *subdic = @{
	    //                                  @"uid":[msg valueForKey:@"uid"],
	    //                                  @"uhead":[msg valueForKey:@"uhead"],
	    //                                  @"uname":[msg valueForKey:@"uname"],
	    //                                  @"coin":[msg valueForKey:@"coin"]
	    //                                  };
	    //         [self.socketDelegate getzhuangjianewmessagedelegatem:subdic];
	    //     }
	    // }
		
	},
	
	/**
	 *  关闭连接
	 */
	close: function (data) {
		socket.close();
	},

    /**
     *  监听
     */
	listeners: function () {
		
		socket.on('broadcastingListen', (msg) => {
			console.log('broadcastingListen', msg);
		});
		socket.on('disconnect', (msg) => {
			console.log('disconnect', msg);
		});
		socket.on('broadcast', (msg) => {
			console.log('broadcast', msg);
		});
		socket.on('heartbeat', (msg) => {
			console.log('heartbeat', msg);
			socket.emit("heartbeat", "heartbeat");
		});
		socket.on('error', (msg) => {
			console.log('error', msg);
		});
		socket.on('conn', (msg) => {
			console.log('conn', msg);
			room.action.zombie();
		});
	},
		
    action: {
		/**
		 *僵尸粉
		 */
		zombie: function () {
			let connData = {
				msg: [
					{
						_method_: "requestFans",
						timestamp:"",
						msgtype: "0",
					}
				],
				retcode: "000000",
				retmsg: "OK"
			};
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *增加映票
		 */
		addvotes: function (data) {
			let connData = {
				msg: [
						{
							_method_: "updateVotes",
							action: "1",
							votes: data.votes,
							msgtype: "26",
							uid: data.uid,
							isfirst: data.isfirst
						}
					],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *关注主播
		 */
		attentionLive: function (data) {
			let connData = {
				msg: [
					{
						_method_: "SystemNot",
						action: "13",
						ct: data.ct,
						msgtype: "4",
						timestamp: "",
						tougood: "",
						touid: "0",
						city:"",
						touname: "",
						ugood: "",
						uid: data.uid,
						uname: data.uname,
						equipment: "app",
						roomnum: data.roomnum,
						usign:"",
						uhead:"",
						level:data.level,
						sex:""
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *房间关闭
		 */
		stopRoom: function (data) {
			let connData = {
				msg: [
					{
						_method_: "stopLive",
						action: "19",
						ct:"",
						msgtype: "1",
						timestamp: "",
						tougood: "",
						touid: "0",
						touname: "",
						ugood: data.ugood,
						uid: data.uid,
						uname: data.uname,
						equipment: "app",
						roomnum: data.roomnum,
						usign:"",
						uhead: data.uhead,
						level: data.level,
						city:"",
						sex:""
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *发送消息
		 */
		sendmessage: function (data) {
			let connData = {
				msg: [
					{
						_method_:"SendMsg",
						action:"0",
						ct: data.ct,
						msgtype:"2",
						timestamp:"",
						tougood:"",
						touid:"0",
						city:"",
						touname:"",
						ugood:"",
						uid: data.uid,
						uname:data.uname,
						equipment:"app",
						roomnum:data.roomnum,
						usign:"",
						uhead:"",
						level:data.level,
						sex:"",
						vip_type:data.vipType,
						liangname:data.liangname,
						isAnchor:"0",
						usertype:data.usertype,
						guard_type:data.guardtype
					}
				],
				retcode:"000000",
				retmsg:"OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *送礼物
		 */
		sendGift: function (data) {
			let connData = {
				msg: [
					{
						_method_: "SendGift",
						action: "0",
						ct:info ,
						msgtype: "1",
						uid: data.uid,
						uname: data.uname,
						equipment: "app",
						roomnum: data.roomnum,
						level:data.level,
						evensend:data.evensend,
						uhead:data.uhead,
						vip_type:data.viptype,
						liangname:data.liangame,
						livename:data.livename,
						paintedPath:data.paintedPath,
						paintedHeight:data.paintedHeight,
						paintedWidth:data.paintedWidth
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *禁言
		 */
		shutUp: function (data) {
			let connData = {
				msg: [
					{
						_method_:"ShutUpUser",
						action:"1",
						ct:data.ct,
						uid:data.uid,
						touid:data.touid,
						showid:data.showid,
						uname:"",
						msgtype:"4",
						timestamp:"",
						tougood:"",
						touname:"",
						ugood:""
					}
				],
				retcode:"000000",
				retmsg:"OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *踢人
		 */
		kickUser: function (data) {
			let connData = {
				msg: [
					{
						_method_:"KickUser",
						action:"2",
						ct:data.ct,
						uid:data.uid,
						touid:data.touid,
						showid:data.showid,
						uname:"",
						msgtype:"4",
						timestamp:"",
						tougood:"",
						touname:"",
						ugood:""
					},
				],
				retcode:"000000",
				retmsg:"OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *弹幕
		 */
		sendBarrage: function (data) {
			let connData = {
				msg: [
					{
						_method_: "SendBarrage",
						action: "7",
						ct:ct ,
						msgtype: "1",
						ugood: data.ugood,
						uid: data.uid,
						uname: data.uname,
						equipment: "app",
						roomnum: data.roomnum,
						level:data.level,
						uhead:data.uhead,
						vip_type:data.viptype,
						liangname:data.liangname
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *点亮
		 */
		starlight: function (data) {
			let connData = {
				msg: [
					{
						_method_: "SendMsg",
						action: "0",
						ct: "我点亮了",
						msgtype: "2",
						uid: data.uid,
						uname: data.nicename,
						equipment: "app",
						roomnum: data.roomnum,
						level:data.level,
						heart: data.heart,
						vip_type: data.viptype,
						liangname: data.liangname,
						usertype: data.usertype,
						guard_type: data.guardType
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *连麦socket
		 */
		sendLianMai: function (data) {
			let connData = {
				msg: [
					{
						_method_:"ConnectVideo",
						action: "5",
						msgtype: "10",
						uid:data.uid,
						uname:data.uname,
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *连麦
		 */
		sendSmall: function (data) {
			let connData = {
				msg: [
					{
						_method_: "updateVotes",
						action:"1",
						votes:data.votes,
						msgtype: "26",
						uid:data.uid,
						isfirst:data.isfirst
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *close connect
		 */
		closeConnect: function (data) {
			let connData = {
				msg: [
					{
						_method_: "ConnectVideo",
						action:"5",
						msgtype: "10",
						uid:data.uid,
						uname:data.uname
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *videoToHost
		 */
		videoToHost: function (data) {
			let connData = {
				msg: [
					{
						_method_: "ConnectVideo",
						action:"1",
						msgtype: "10",
						uid:data.uid,
						uname:data.uname,
						uhead:data.uhead,
						level:data.level,
						sex:data.sex
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *buyGuard
		 */
		buyGuard: function (data) {
			let connData = {
				msg: [
					{
						_method_: "BuyGuard",
						action:"0",
						msgtype: "0",
						ct:"守护了主播",
						uid:data.uid,
						uname:data.uname,
						uhead:data.uhead,
						votestotal:data.votestotal,
						guard_nums:data.guardnums
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *fahongbaola
		 */
		fahongbaola: function (data) {
			let connData = {
				msg: [
					{
						_method_: "SendRed",
						action: "0",
						ct:"在直播间发红包啦！快去抢哦",
						msgtype: "0",
						timestamp: "",
						touid: "0",
						ugood: data.ugood,
						uid: data.uid,
						uname: data.uname,
						equipment: "app",
						uhead:data.uhead,
						level:data.level,
						vip_type:data.viptype,
						liangname:data.liangname,
						isAnchor:"0"
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *stakePoke
		 */
		stakePoke: function (data) {
			let connData = {
				msg: [
					{
						_method_: data.method,
						action: "5",
						msgtype:data.msgtype,
						type:data.type,
						money:data.money,
						uid:data.uid
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *stakeRotationPoke
		 */
		stakeRotationPoke: function (data) {
			let connData = {
				msg: [
					{
						_method_: "startRotationGame",
						action: "5",
						msgtype:"16",
						type:data.type,
						money:data.money,
						uid:data.uid
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
		/**
		 *getzhuangjianewm
		 */
		getzhuangjianewm: function (data) {
			let connData = {
				msg: [
					{
						_method_:"shangzhuang",
						action:"1",
						msgtype:"25",
						uid:data.uid,
						uhead:data.uhead,
						uname:data.uname,
						coin:data.coin
					}
				],
				retcode: "000000",
				retmsg: "OK"
			}
			console.log(connData);
			socket.emit('broadcast', connData);
		},
		
    //     /**
    //      *
    //      *  超管弹幕刷新
    //      *
    //      * @return mixed $data default string,
    //      * @example
    //      * 说明：
    //      *
    //      */
    //     barrage: {
    //         tpl: function () {
    //             return {
    //                 retcode: "000000",
    //                 retmsg: "ok",
    //                 msg: [
    //                     {
    //                         _method_: 'barrage-refresh',
    //                         action: "0",
    //                         touid: 0,
    //                         msgtype: "1",
    //                         uname: 'sys-super',
    //                         uid: '-10000',
    //                         liangname: "0",
    //                         vip_type: "0",
    //                         ct: '',
    //                         guard_type: "10",
    //                         usertype: "60",
    //                     },
    //                 ],
    //             };
    //         },
    //         //刷新
    //         refresh: function () {
    //             console.log(room.action.barrage.tpl());
    //             socket.emit("broadcast", room.action.barrage.tpl());
    //         }
    //     },
    //     /**
    //      *
    //      *  超管踢出
    //      *
    //      * @return mixed $data default string,
    //      * @example
    //      * 说明：
    //      *
    //      */
    //     kick: {
    //         //模板
    //         tpl: function (paermission, uid, nick_name) {
    //             return {
    //                 retcode: "000000",
    //                 retmsg: "ok",
    //                 msg: [
    //                     {
    //                         _method_: "KickUser",
    //                         action: "2",
    //                         touid: uid,
    //                         touname: nick_name,
    //                         msgtype: "4",
    //                         uname: nick_name,
    //                         uid: uid,
    //                         liangname: "0",
    //                         vip_type: "0",
    //                         ct: nick_name + "被踢出房间",
    //                         guard_type: "10",
    //                         usertype: "30",
    //                     },
    //                 ],
    //             };
    //         },
    //         click: function (nick_name, paermission, uid, room_id) {
    //             room.alert(nick_name, paermission, uid, room_id, config.kick, room.action.kick.send);
    //         },
    //         emit: function (nick_name, paermission, uid, room_id) {
    //             room.ajax(config.method, '/admin/onlines-kick/' + uid + '/' + room_id, function (data) {
    //                 if (data.code == 200) {
    //                     //删除
    //                     room.showHide(data.data.paermission, uid, room_id, 'kick');
    //                     if (data.data.paermission == 'disabled') {
    //                         //广播通知
    //                         socket.emit("broadcast", room.action.kick.tpl(data.data.paermission, uid, nick_name));
    //                     }
    //                     //提示操作成功
    //                     room.alertSuccess();
    //                 } else {
    //                     //提示操作失败
    //                     room.alertError(data.message);
    //                 }
    //             });
    //         },

    },

    //     /**
    //      *
    //      *  超管禁言
    //      *
    //      * @return mixed $data default string,
    //      * @example
    //      * 说明：
    //      *
    //      */
    //     shut: {
    //         //模板
    //         tpl: function (paermission, uid, nick_name) {
    //             let method =
    //                 paermission == "disabled" ? "ShutUpUser" : "ResumeUser";
    //             return {
    //                 retcode: "000000",
    //                 retmsg: "ok",
    //                 msg: [
    //                     {
    //                         _method_: method,
    //                         action: "0",
    //                         touid: uid,
    //                         msgtype: "1",
    //                         uname: nick_name,
    //                         uid: uid,
    //                         liangname: "0",
    //                         vip_type: "0",
    //                         ct: nick_name + (method == "ShutUpUser" ? "被禁言了" : "禁言解除了"),
    //                         guard_type: "10",
    //                         usertype: "30",
    //                     },
    //                 ],
    //             };
    //         },
    //         click: function (nick_name, paermission, uid, room_id) {
    //             room.alert(nick_name, paermission, uid, room_id, config.shut, room.action.shut.send);
    //         },
    //         emit: function (nick_name, paermission, uid, room_id) {
    //             room.ajax(config.method, '/admin/onlines-shut/' + uid + '/' + room_id, function (data) {
    //                 if (data.code == 200) {
    //                     //隐藏或显示图标
    //                     room.showHide(data.data.paermission, uid, room_id, 'shut');
    //                     //广播通知
    //                     socket.emit("broadcast", room.action.shut.tpl(data.data.paermission, uid, nick_name));
    //                     //提示操作成功
    //                     room.alertSuccess();
    //                 } else {
    //                     //提示操作失败
    //                     room.alertError(data.message);
    //                 }
    //             });
    //         },
    //     }

    // },
    // alertSuccess: function () {
    //     swal({
    //         title: '操作成功',
    //         icon: 'success',
    //     });
    // },
    // alertError: function (message) {
    //     swal({
    //         title: message,
    //         icon: 'warning',
    //     });
    // },
    // alert: function (nick_name, paermission, uid, room_id, text, callback) {
    //     swal({
    //         title: paermission == "allow" ? "是否确认" + text : "是否确认解除" + text,
    //         text: "",
    //         type: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "确认",
    //         cancelButtonText: "取消",
    //     }).then(function (res) {
    //         if (res.value) {
    //             return callback(nick_name, paermission, uid, room_id);
    //         }
    //     });
    // },
    // showHide: function (paermission, uid, room_id, id) {
    //     if (paermission == 'allow') {
    //         $('#' + id + '_' + uid + '_' + room_id + '_allow').show();
    //         $('#' + id + '_' + uid + '_' + room_id + '_disabled').hide();
    //     } else {
    //         $('#' + id + '_' + uid + '_' + room_id + '_allow').hide();
    //         $('#' + id + '_' + uid + '_' + room_id + '_disabled').show();
    //     }
    // },
    // ajax: function (method, url, callback) {
    //     $.ajax({method: method, url: url, success: callback});
    // }

}

export default {
	// live,
	room
}