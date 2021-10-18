import config from './config.js'
import live from './liveRequest.js'
import md5 from '@/components/js_sdk/js-md5/build/md5.min.js'
// #ifdef H5
import Fingerprint2 from 'fingerprintjs2'
// #endif

export default {
	live,
	config: {
		baseUrl: config.rootPath,
		header: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {},
		isLoading: false, // 是否显示加载loading
	},
	interceptor: {
		request: null,
		response: null
	},
	async request(options) {
		const oldOptions = Object.assign({}, options);
		const requestName = options.url;
		if (!options) {
			options = {};
		}
		options.baseUrl = options.baseUrl || uni.getStorageSync('baseServerUrl') || this.config.baseUrl;
		options.dataType = options.dataType || this.config.dataType;
		options.url = options.baseUrl + options.url;
		options.data = options.data || "";
		options.method = options.method || this.config.method;
		
		// 当data有值 需要base64 注意需要排除上传头像接口
		let signData = '';
		if(options.data && JSON.stringify(options.data) !== '{}' && ![config.api.uploadHeadImg].includes(oldOptions.url)) {
			options.data = 'molixg' + btoa(encodeURIComponent(JSON.stringify(options.data))); // 先 encodeURIComponent 为了解决中文导致 btoa 报错
			signData = options.data;
		}
		
		// 获取基座包名-主要用于获取ios的
		let bundleIdentifier = 'lebo';
		// 获取系统信息
		const deviceInfo = uni.getSystemInfoSync(); // 获取设备信息1
		
		let platform = 0;
		// #ifdef APP-PLUS
		switch (deviceInfo.platform) {
			case 'android':
				platform = 1;
				break;
			case 'ios':
				platform = 2;
				// 获取ios包名
				if (uni.getStorageSync('bundleIdentifier')) {
					bundleIdentifier = uni.getStorageSync('bundleIdentifier');
				} else {
					var NSBundle = plus.ios.importClass('NSBundle');
					var bundle = NSBundle.mainBundle();
					bundleIdentifier = bundle.bundleIdentifier();
					uni.setStorageSync('bundleIdentifier', bundleIdentifier);
				}
				break;
			default:
				platform = 0;
		}
		
		// 获取设备uuid
		let uuid = plus.device.uuid || ''; //getInfo.uuid;
		uni.setStorageSync('uuid', uuid);
		// 获取wgt-版本号等
		let wgtInfo = uni.getStorageSync('wgtInfo') || '';
		if (![config.api.saveVideoWatchat].includes(oldOptions.url) && ![config.api.saveVideoPlayTime].includes(oldOptions.url)) {
			wgtInfo = await _getWgtInfo() || ''; // 获取wgt信息
			uni.setStorageSync('wgtInfo', wgtInfo);
		}
		const wgtVersion = wgtInfo.version || ''; // wgt-版本号
		// 获取渠道相关信息
		let channelInfo = uni.getStorageSync('channelInfo') || '';
		if (!channelInfo) {
			channelInfo = await _getChannelInfo(); // 获取渠道号 邀请码 代理 等
		}
		// #endif
		
		// #ifdef H5
		let uuid = uni.getStorageSync('uuid') || '';
		if (!uuid) {
			uuid = await _getFingerprintId();
			// uuid = '';
		}
		const wgtInfo = "";
		const wgtVersion = "";
		const channelInfo = {};
		if (sessionStorage.channel) channelInfo.channel = sessionStorage.channel;
		if (sessionStorage.invite_code) channelInfo.invite_code = sessionStorage.invite_code;
		if (sessionStorage.i_code) channelInfo.i_code = sessionStorage.i_code;
		// #endif
		
		// token 设置
		const token = uni.getStorageSync('token') || '';
		// 获取当前时间
		let timeStamp = new Date().getTime();
		// if (uni.getStorageSync('timeDiff')) {
		// 	timeStamp = timeStamp + parseInt(uni.getStorageSync('timeDiff'));
		// }
		// 生成签名
		const key = 'c5zKcW45KYGvrlCVEVvGysnjyCh3sg4r'; // 密钥
		const sign = md5(`${key}${signData}${uuid}${timeStamp}${oldOptions.url}${key}`).toUpperCase();
		
		// header设置
		// #ifdef APP-PLUS
		options.header = Object.assign({}, options.header, {
			'APP-TYPE': platform, // 设备类型 1:Android 2:ios
			'APP-VERSION': uni.getStorageSync('iosVersion') || plus.runtime.version, // app基座版本 plus.runtime.version
			'APPLETS-VERSION': wgtVersion, // 小程序版本 wgtVersion
			'BRAND-MODEL': deviceInfo.brand + '_' + deviceInfo.model, // 手机品牌型号
			'TOKEN': token,
			'UDID': uuid, // 设备号
			'CHANNEL': channelInfo.channel || 100000, // 渠道号 
			'INVITE-CODE': channelInfo.invite_code || 0, // 邀请码 
			'TIMESTAMP': timeStamp, // 当前时间戳-毫秒
			'SIGN': sign, // 签名
			'PACK-NAME': bundleIdentifier, // 包名
			'TUNNEL': btoa(encodeURIComponent(JSON.stringify(channelInfo))), // 服务端参数 渠道/邀请码/代理 {channel: 110, invite_code: 119, i_code: 120}
		});
		// #endif
		// #ifdef H5
		options.header = Object.assign({}, options.header, {
			'APP-TYPE': 3, // 设备类型 1:Android 2:ios 3:h5
			'APP-VERSION': '1.0.0', // app基座版本 plus.runtime.version
			'APPLETS-VERSION': '1.0.0', // 小程序版本 wgtVersion
			'BRAND-MODEL': 'h5_' + deviceInfo.model, // 手机品牌型号
			'TOKEN': token,
			'UDID': uuid, // 设备号
			'CHANNEL': channelInfo.channel || 100000, // 渠道号 
			'INVITE-CODE': channelInfo.invite_code || 0, // 邀请码 
			'TIMESTAMP': timeStamp, // 当前时间戳-毫秒
			'SIGN': sign, // 签名
			'PACK-NAME': bundleIdentifier, // 包名
			'TUNNEL': btoa(encodeURIComponent(JSON.stringify(channelInfo))), // 服务端参数 渠道/邀请码/代理 {channel: 110, invite_code: 119, i_code: 120}
		});
		// #endif

		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				uni.hideLoading() // 清除loading
				let statusCode = response.statusCode
				response.config = _config
				// if (process.env.NODE_ENV === 'development') {
				// 	if (statusCode === 200) {
				// 		console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
				// 	}
				// }
				
				// 解密服务端返回的数据
				if (response.data && config.util.isString(response.data) && response.data.indexOf("molixg") === 0) {
					response.data = JSON.parse(atob(response.data.replace('molixg','')));
				}
				// 有token需要更新
				if (response.header && response.header['NEW-TOKEN']) {
					uni.setStorageSync('token', response.header['NEW-TOKEN']); // 更新token
					// 强制重新调起授权接口
					uni.$emit('handleGlobalEvent', {type: 'loginInvalid'});
					reject('loginInvalid');
				}
				// 获取服务器时间
				if (response.header && response.header['TIME']) {
					const currentTime = new Date().getTime();
					const serverTime = parseInt(response.header['TIME']);
					uni.setStorageSync('serverTime', serverTime); // 服务器时间
					uni.setStorageSync('timeDiff', serverTime - currentTime); // 和服务器时间差
				}
				// 用户身份是否会员相关操作
				if (response.header && response.header['IS-VIP']) {
					const getIsVip = parseInt(response.header['IS-VIP']);
					// 判断用户身份是否变更
					if (uni.getStorageSync('isVip') && parseInt(uni.getStorageSync('isVip')) !== getIsVip) {
						uni.$emit('handleGlobalEvent', {type: 'updateUserInfo'});
					}
					uni.setStorageSync('isVip', getIsVip); // 用户Vip状态 vip 1:是 2:否
					
					// 判断会员过期-弹框提醒用户
					// if (getIsVip === 2 && uni.getStorageSync('userInfo') && parseInt(uni.getStorageSync('userInfo').is_vip) === 1) {
					// 	const pages = getCurrentPages();
					// 	const page = pages[pages.length - 1];
					// 	// #ifdef APP-PLUS
					// 	const currentWebview = page.$getAppWebview();
					// 	if (page && page.route !== 'pages/popup/popup') {
					// 		uni.navigateTo({
					// 			url: '/pages/popup/popup?type=vipExpired'
					// 		})
					// 	}
					// 	// #endif
					// }
				}
				
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				
				// 统一的响应日志记录
				_reslog(response)
				if (!statusCode) { // 无网络表示网络不通
					// const pages = getCurrentPages();
					// const page = pages[pages.length - 1];
					// // #ifdef APP-PLUS
					// const currentWebview = page.$getAppWebview();
					// if (page && page.route !== 'pages/popup/popup') {
					// 	// 用户已封禁-提示弹框
					// 	uni.navigateTo({
					// 		url: `/pages/popup/popup?type=network`
					// 	})
					// }
					// // #endif
					
					// 记录请求失败的
					const tempNoNetworkRequest = uni.getStorageSync('tempNoNetworkRequest') || [];
					tempNoNetworkRequest.push(oldOptions);
					uni.setStorageSync('tempNoNetworkRequest', tempNoNetworkRequest);
					
					uni.showToast({
						icon: 'none',
						title: '网络连接错误'
					});
				
					reject('nonetwork')
				}
				uni.removeStorageSync('tempNoNetworkRequest'); // 清除断网记录的请求
				
				if (statusCode === 200) { //成功
					if (response.data && response.data.code === 0) { 
						// token过期-再次请求接口获取数据
						const filterUrl = [
							config.api.auth,
							config.api.register,
							config.api.login,
							config.api.qrcodeLogin,
							config.api.bindMobile,
							config.api.changeMobile,
							config.api.registerV1,
							config.api.loginV1,
							config.api.bindMobileV1
						]; // 需要排除的接口
						const newToken = response.data.data.token;
						if (newToken && token !== newToken && !filterUrl.includes(oldOptions.url)) {
							uni.setStorageSync('token', newToken); // 更新token
							this.request(oldOptions); // 再次请求
							
							reject(response)
						}
						
						// 判断直播用户-出现不可用
						if (response.data.data && response.data.data.zb_info && response.data.data.zb_info.code && response.data.data.zb_info.code !== 0) {
							// plus.nativeUI.showWaiting("您的账号出现异常不可使用，请联系客服", {
							// 	width: '200px',
							// 	height: '150px',
							// 	size: '14px',
							// 	loading: {
							// 		height: '50px',
							// 		icon: '/static/logo-1.png'
							// 	}
							// });
							
							reject(response);
						}
						
						
						// 请求成功
						resolve(response.data);
					} else if (response.data && response.data.code === 1001) {
						// app强制更新-禁止用户使用
						const upgradeText = response.data.data.description || '';
						const upgradeUrl = response.data.data.app_url || '';
						const pages = getCurrentPages();
						const page = pages[pages.length - 1];
						// #ifdef APP-PLUS
						const currentWebview = page.$getAppWebview();
						if (page && page.route !== 'pages/popup/popup') {
							uni.navigateTo({
								url: `/pages/popup/popup?type=upgrade&upgradeType=1&upgradeText=${upgradeText}&upgradeUrl=${upgradeUrl}`
							})
						}
						// #endif
						
						reject(response)
					} else if (response.data && response.data.code === 1002) {
						// 小程序强制更新-禁止用户使用
						const upgradeText = response.data.data.description || '';
						const pages = getCurrentPages();
						const page = pages[pages.length - 1];
						// #ifdef APP-PLUS
						const currentWebview = page.$getAppWebview();
						if (page && page.route !== 'pages/popup/popup') {
							uni.navigateTo({
								url: `/pages/popup/popup?type=upgrade&upgradeType=2&upgradeText=${upgradeText}`
							})
						}
						// #endif
						
						reject(response)
					}  else if (response.data && response.data.code === 1003) {
						// 用户已封禁
						const time = response.data.data.time || 0;
						const pages = getCurrentPages();
						const page = pages[pages.length - 1];
						// #ifdef APP-PLUS
						const currentWebview = page.$getAppWebview();
						if (page && page.route !== 'pages/popup/popup') {
							// 用户已封禁-提示弹框
							uni.navigateTo({
								url: '/pages/popup/popup?type=warning&time='+time
							})
						}
						// #endif
						
						reject(response);
					} else if (response.data && response.data.code === 1006) {
						// 用户登录状态失效
						uni.$emit('handleGlobalEvent', {type: 'loginInvalid'});
						
						reject(response);
					} else if (response.data && response.data.code === 1007) {
						// 英皇登录状态失效
						// uni.$emit('handleGlobalEvent', {type: 'yhLoginInvalid'});
						
						reject(response);
					} else {
						// 统一错误提示
						uni.showToast({
							icon: 'none',
							title: response.data.message || '未知系统错误'
						});
						
						reject(response);
					}
					// else if (response.data && response.data.code === 1003) { 
					// 	// Token异常-删除
					// 	// uni.removeStorageSync('token');
					// }
					
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = requestName
			// 判断是否显示loading 默认不显示
			if (_config.isLoading) {
				uni.showLoading({
				  title: '请稍后...',
					mask: true
				});
			}

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			_reqlog(Object.assign({}, _config, {data: oldOptions.data}))
			// _reqlog(_config)

			uni.request(_config);
		});
	},
	get(options) {
		if (!options) {
			options = {}
		}
		options.method = 'GET'
		return this.request(options)
	},
	post(options) {
		if (!options) {
			options = {}
		}
		options.method = 'POST'
		return this.request(options)
	},
	put(options) {
		if (!options) {
			options = {}
		}
		options.method = 'PUT'
		return this.request(options)
	},
	delete(options) {
		if (!options) {
			options = {}
		}
		options.method = 'DELETE'
		return this.request(options)
	}
}

// 获取渠道号-邀请码
function _getChannelInfo() {
	return new Promise((resolve, reject) => {
		uni.getClipboardData({
			complete: (res) => {
				try{
					// 必须内容开头条件满足才是需要解析的内容
					if (res.data && decodeURIComponent(res.data).indexOf("molixg") === 0) {
						const channelStr = atob(decodeURIComponent(res.data).replace('molixg',''));
						if (channelStr && config.util.isJsonString(channelStr)) {
							const channelObj = JSON.parse(channelStr);
							if (channelObj) {
								uni.setStorageSync('channelInfo', {
									channel: channelObj.channel_id || '',
									invite_code: channelObj.invite_code || ''
								});
								resolve({
									channel: channelObj.channel_id || '',
									invite_code: channelObj.invite_code || ''
								})
							}
						}
					} else if (res.data && res.data.indexOf("lebo_channel") >= 0 && config.util.isJsonString(res.data)) {
						const channelObj = JSON.parse(res.data);
						if (channelObj && channelObj.lebo_channel) {
							uni.setStorageSync('channelInfo', channelObj);
							resolve(channelObj);
						}
					} else if (res.data && res.data.lebo_channel) {
						uni.setStorageSync('channelInfo', res.data);
						resolve(res.data);
					}
					resolve({})
				}catch(e){
					resolve({})
				}
			}
		});
	})
}
// 获取wgt信息
function _getWgtInfo() {
	return new Promise((resolve, reject) => {
		try {
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				resolve(wgtinfo)
			});
		} catch (e) {
			reject(e)
		}
	})
}
// 获取设备标记-uuid
function _getInfo() {
	return new Promise((resolve, reject) => {
		plus.device.getInfo({
			success: function(e) {
				resolve(e)
			},
			fail: function(e) {
				reject(e)
			}
		});
	})
}
// 获取h5浏览器指纹
function _getFingerprintId() {
	return new Promise((resolve, reject) => {
		try {
			// #ifdef H5
			Fingerprint2.get(function(components) {
				const values = components.map(function(component,index) {
					if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
						return component.value.replace(/\bNetType\/\w+\b/, '');
					}
					return component.value;
				})
				// 生成最终id murmur   
				const murmur = Fingerprint2.x64hash128(values.join(''), 31);
				uni.setStorageSync('uuid', murmur);
				
				resolve(murmur);
			})
			// #endif
		} catch (e) {
			reject(e)
		}
	})
}

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.header) {
			console.log("【" + req.requestId + "】 请求头：" + JSON.stringify(req.header))
		}
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}
/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		// if (res.config.data) {
		// 	console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		// }
		// console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res.data))
		console.log("【" + res.config.requestId + "】 响应结果：", res.data)
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}
