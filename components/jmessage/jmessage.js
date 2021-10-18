import JMessage from "@/components/jmessage/jmessage-wxapplet-sdk-1.4.3.min.js";
import md5 from "@/components/js_sdk/js-md5/build/md5.min.js";
const appKey = "f3dd86239d3d923d20dd536d";

export default class JIM{
	constructor() {
		this.jim = null;
	}
	randomString(length = 36) {
		let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let result = '';
		for (let i = length; i > 0; --i) 
				result += str[Math.floor(Math.random() * str.length)];
		return result;
	}
	// 初始化jim
	jimInit() {
		// 保证只有一个实例，不然总会出现断开的情况
		if (!this.jim) {
			this.jim = new JMessage({
				debug: false //是否开启调试模式
			})
		}
		
		// 异常断线监听
		this.jim.onDisconnect(function() {
			console.log("【disconnect】");
		});
		// 消息监听事件
		this.jim.onEventNotification(function(data) {
			console.log('JIM--event_receive: ' + JSON.stringify(data));
		});
		// 消息已读数变更事件实时监听
		this.jim.onMsgReceiptChange(function(data) {
			console.log('JIM--onMsgReceiptChange:' + JSON.stringify(data));
		});
		// 聊天消息实时监听
		this.jim.onMsgReceive(function(data) {
			console.log('JIM--onMsgReceive:' + JSON.stringify(data));
		});
		// 离线消息同步监听
		this.jim.onSyncConversation(function(data) {
			console.log('JIM--onSyncConversation:' + JSON.stringify(data));
		});
		
		const timestamp = new Date().getTime();
		const secret = "1ae57ae014b03256f328a074";
		const random_str = this.randomString();
		// 生成签名
		const signature = md5(`appkey=${appKey}&timestamp=${timestamp}&random_str=${random_str}&key=${secret}`);
		// this.jim.init({
		// 	"appkey": appKey,
		// 	"random_str": random_str,
		// 	"signature": signature,
		// 	"timestamp": timestamp
		// }).onSuccess(function(data) {
		// 	console.log('success:' + JSON.stringify(data));
		// }).onFail(function(data) {
		// 	console.log('error:' + JSON.stringify(data))
		// });
		
		return new Promise((resolve, reject) => {
			this.jim.init({
				"appkey": appKey,
				"random_str": random_str,
				"signature": signature,
				"timestamp": timestamp
			}).onSuccess(function(data) {
				console.log('JIM--init--success:' + JSON.stringify(data));
				resolve(data);
			}).onFail(function(data) {
				console.log('JIM--init--error:' + JSON.stringify(data));
				reject(data);
			});
		})
	}
	// 注册  username-用户名
	register(username) {
		return new Promise((resolve, reject) => {
			this.jim.register({
				'username': `lb_${username}`,
				'password': `${username}PUSH`
			}).onSuccess(function(data) {
				console.log('JIM--register--success:' + JSON.stringify(data));
				resolve(data);
			}).onFail(function(data) {
				console.log('JIM--register--error:' + JSON.stringify(data));
				resolve(data);
			});
		})
	}
	// 登录 username-用户名
	async login(username) {
		// 初始化
		if (!this.jim || !this.jim.isInit()) {
			await this.jimInit();
		}
		// 判断是否登陆
		if (this.jim.isLogin()) {
			this.jim.loginOut();
		}
		// 执行注册
		await this.register(username);
		
		// 执行登陆
		this.jim.login({
			'username': `lb_${username}`,
			'password': `${username}PUSH`
		}).onSuccess((loginData) => {
			this.jimUserInfo = {username};
			console.log('JIM--login--success:' + JSON.stringify(loginData));
			
			// // 消息监听事件
			// this.jim.onEventNotification(function(data) {
			// 	console.log('JIM--event_receive: ' + JSON.stringify(data));
			// });
			// // 消息已读数变更事件实时监听
			// this.jim.onMsgReceiptChange(function(data) {
			// 	console.log('JIM--onMsgReceiptChange:' + JSON.stringify(data));
			// });
			// // 聊天消息实时监听
			// this.jim.onMsgReceive(function(data) {
			// 	console.log('JIM--onMsgReceive:' + JSON.stringify(data));
			// });
			// // 离线消息同步监听
			// this.jim.onSyncConversation(function(data) {
			// 	console.log('JIM--onSyncConversation:' + JSON.stringify(data));
			// });
			
		}).onFail(function(data) {
			console.log('JIM--login--error:' + JSON.stringify(data));
		}).onTimeout(function(data) {
			console.log('JIM--login--timeout:' + JSON.stringify(data));
		});
	}
	// 获取会话未读数
	getUnreadMsgCnt() {
		let count = 0;
		if (this.jim && this.jimUserInfo && this.jimUserInfo.username) {
			count = this.jim.getUnreadMsgCnt({'username' : this.jimUserInfo.username});
		}
		return count;
	}
	// 获取会话列表
	getConversation() {
		return new Promise((resolve, reject) => {
			if (this.jim) {
				this.jim.getConversation().onSuccess(function(data) {
					console.log('JIM--getConversation: ' + JSON.stringify(data))
					resolve(data);
				}).onFail(function(data) {
					//data.code 返回码
					//data.message 描述
					reject(data);
				});
			} else {
				reject('');
			}
		})
	}
	// 发送消息
	sendSingleMsg(params) {
		return new Promise((resolve, reject) => {
			if (this.jim) {
				this.jim.sendSingleMsg(params).onSuccess(function(data) {
					console.log('JIM--sendSingleMsg: ' + JSON.stringify(data))
					resolve(data);
				}).onFail(function(data) {
					//data.code 返回码
					//data.message 描述
					reject(data);
				});
			} else {
				reject('');
			}
		})
	}
	// 获取消息 params
	getMessages() {
		const secret = "1ae57ae014b03256f328a074";
		const base64_auth_string = btoa(`${appKey}:${secret}`);
		return new Promise((resolve, reject) => {
			uni.request({
				url: `https://report.im.jpush.cn/v2/messages?count=500&begin_time=2021-06-21 10:10:10&end_time=2021-06-21 20:10:12`,
				header: {
					'Authorization': `Basic ${base64_auth_string}` //自定义请求头信息
				},
				success: (res) => {
					console.log(res.data);
				}
			});
		})
	}
}