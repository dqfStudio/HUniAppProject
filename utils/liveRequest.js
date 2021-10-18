/**
 * 直播请求封装
 * 2021-05-11
 */

import config from './config.js'

export default {
	config: {
		baseUrl: config.liveRootPath, // 请求地址
		data: {},
		method: "POST", // 直播接口默认post
		success() {},
		fail() {},
		complete() {},
		isLoading: false, // 是否显示加载loading
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		const oldOptions = Object.assign({}, options);
		const requestName = options.url;
		if (!options) {
			options = {};
		}
		options.baseUrl = options.baseUrl || uni.getStorageSync('liveBaseServerUrl') || this.config.baseUrl;
		options.dataType = options.dataType || this.config.dataType;
		options.data = options.data || {};
		options.method = options.method || this.config.method;
		// 请求地址参数拼接
		const queryString = Object.keys(options.data).map(key => key + "=" + options.data[key]).join("&");
		options.url = `${options.baseUrl}/appapi/?service=${options.url}&${queryString}`;
		delete options.data; // 清除data数据，因为直播接口用拼接方式传递参数

		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				uni.hideLoading() // 清除loading
				let statusCode = response.statusCode
				response.config = _config
				
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				
				// 统一的响应日志记录
				_reslog(response)
				if (!statusCode) {
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
					if (response.data && response.data.ret === 200 && response.data.data && response.data.data.code === 0) {
						// 请求成功
						resolve(response.data.data);
					} else if (response.data && response.data.ret === 200 && response.data.data && response.data.data.code === 700) {
						// 用户登录状态失效
						// uni.showToast({
						// 	icon: 'none',
						// 	title: (response.data.data && response.data.data.msg) || '未知错误'
						// });
						uni.$emit('handleGlobalEvent', {type: 'loginInvalid'});
						reject(response);
					} else {
						// 统一错误提示
						uni.showToast({
							icon: 'none',
							title: (response.data.data && response.data.data.msg) || '未知系统错误'
						});
						
						reject(response);
					}
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
			_reqlog(_config)

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
