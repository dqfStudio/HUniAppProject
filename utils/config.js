import CryptoJS from './crypto-js.js';
// 加密key
const AesKey = 'c5zKcW45KYGvrlCVEVvGysnjyCh3sg4r';


// #ifdef APP-PLUS
// // 公共接口请求地址
 const rootPath = "http://43.129.186.219:8010";
// const rootPath = process.env.NODE_ENV === 'development' ? "http://43.129.186.219:8010" : "";
// #endif

// #ifdef H5
 const rootPath = "http://43.129.186.219:8010";
// const rootPath = process.env.NODE_ENV === 'development' ? "http://43.129.186.219:8010" : "https://baidu.com";
// #endif

// api 地址
const api = {
	startAdvert: "/api/start/ad", // 启动页广告
}

// 工具
const util = {
	// 获取app信息
	getAppInfo() {
		if (uni.getStorageSync('wgtInfo')) {
			return uni.getStorageSync('wgtInfo');
		}else {
			return {
				name: '淘宝'
			};
		}
	},
	/**
	 * AES加密
	 * @param {Object/String} value - 加密内容
	 * @return {String} 返回加密字符串
	 */
	encryptAes(value) {
		if (typeof value == "object") {
			value = JSON.stringify(value);
		}
		const data = CryptoJS.enc.Utf8.parse(value);
		const key = CryptoJS.enc.Utf8.parse(AesKey);
		const encrypted = CryptoJS.AES.encrypt(data, key, {
			mode: CryptoJS.mode.ECB
		});
		return encrypted.toString();
	},
	/**
	 * AES解密
	 * @param {String} value - 解密内容
	 * @return {Object/String} 返回值
	 */
	decryptAes(value) {
		const key = CryptoJS.enc.Utf8.parse(AesKey);
		const decrypted = CryptoJS.AES.decrypt(value, key, {
			mode: CryptoJS.mode.ECB
		});
		const decryptText = decrypted.toString(CryptoJS.enc.Utf8);
		return util.isJsonString(decryptText) ? JSON.parse(decryptText) : decryptText;
	},
	/**
	 * 安卓侧滑退出
	 */
	backQuit: () => {
		const deviceInfo = uni.getSystemInfoSync() // 获取设备信息
		if (deviceInfo.platform === 'android') { // 安卓单独走
			uni.showModal({
				title: '提示',
				content: `您是否要退出${util.getAppInfo().name}app呢？`,
				success: function(res) {
					if (res.confirm) {
						// 退出当前应用，改方法只在App中生效  
						// plus.runtime.quit();
						uni.sendNativeEvent('appQuit', {}, ret => {})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	},
	/**
	 * 判断是否外跳链接
	 * @param {String} url - 链接地址
	 * @return {Boolean} 返回是否
	 */
	isWebLink:(url = '') => {
		if (url.indexOf("https://") === 0 || url.indexOf("http://") === 0) {
			return true;
		}
		return false;
	},
	gotoWeb:(url, type = 0, title = '') => {
		switch (type) {
			case 0://小程序或H5内部浏览器，兼容小程序和H5
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + encodeURIComponent(url) + '&title=' + title
				});
				break;
			case 1://打开手机APP内部浏览器
				// #ifdef APP-PLUS
				plus.runtime.openWeb(url);
				// #endif
				break;
			case 2://打开手机APP外部浏览器
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);
				// #endif
				break;
			default:
				break;
		}
	},
	gotoPage:(url, type = 0) => {
		switch (type) {
			case 0:
				// 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
				// 要注意的是navigateTo只能跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数；如果跳转url参数为tabBar的路径则无法进行跳转
				uni.navigateTo({
				    url: url
				})
				break;
			case 1:
				// 关闭当前页面，跳转到应用内的某个页面。
				// 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数
				uni.redirectTo({
					url: url
				});
				break;
			case 2:
				// 关闭所有页面，打开到应用内的某个页面。
				// 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；
				// 如 'path?key=value&key2=value2'，与redirectTo不同的是如果跳转的页面路径是 tabBar 页面则不能带参数
				uni.reLaunch({
					url: url
				})
				break;
			default:
				break;
		}
	},
	gotoTab:(url, type = 0) => {
		switch (type) {
			case 0:
				// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				// 需要跳转的 tabBar 页面的路径，路径后不能带参数
				uni.switchTab({
					url: url
				});
				break;
			case 1:
				// 动态设置tabBar时，系统的switchTab不可用，可用以下跳转方法代替
				uni.redirectTo({
					url: url
				});
				break;	
			default:
				break;
		}
	},
	// 统计数据单位转化
	unitToW: (value = 0) => {
		value = parseInt(value);
		if (value >= 10000) {
			return (value / 10000).toFixed(1) + 'w';
		} else {
			return value
		}
	},
	// 钱格单位转化
	moneyUnit: (value) => {
		value = parseInt(value);
		return (value / 100).toFixed(2);
	},
	/**
	 * tab切换
	 * @param {Array} paramData - 原数组
	 * @param {number} paramCount - 拆分为多少个一组
	 */
	arraySplitGroup: (paramData, paramCount = 2) => {
		let index = 0;
		let count = paramCount;
		let arrTemp = [];
		let data = paramData || [];
		for (let i = 0; i < data.length; i++) {
			index = parseInt(i / count);
			if (arrTemp.length <= index) {
				arrTemp.push([]);
			}
			arrTemp[index].push(data[i])
		}
		return arrTemp
	},
	/**
	 * 格式化文件大小
	 * @param {Number} filesize - 文件的大小,传入的是一个bytes为单位的参数
	 * @param {Number} end - 后面面保留位数
	 * @return {String} 格式化后的值
	 */
	renderSize(filesize) {
		if (null == filesize || filesize == '') {
			return "0 Bytes";
		}
		let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
		let index = 0,
			srcsize = parseFloat(filesize);
		index = Math.floor(Math.log(srcsize) / Math.log(1024));
		let size = srcsize / Math.pow(1024, index);
		// 保留的小数位数
		size = size.toFixed(1);
		return size + unitArr[index];
	},
	/**
	 * 判断是否是对象
	 * @param {Object} obj 内容
	 * @return {Boolean} 返回是否
	 */
	isObject(obj) {
		try {
			if (Object.prototype.toString.call(obj) === '[object Object]') {
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	},
	/**
	 * 判断是否是json字符串
	 * @param {String} str 字符串内容
	 * @return {Boolean} 返回是否
	 */
	isJsonString(str) {
		try {
			if (typeof JSON.parse(str) === 'object') {
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	},
	/**
	 * 判断是否是字符串
	 * @param {String} str 字符串内容
	 * @return {Boolean} 返回是否
	 */
	isString(str) {
		try {
			if (typeof str === 'string') {
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	},
	/**
	 * 数组的扁平化
	 * @param {Array} arr 数组
	 * @return {Array} 返回一维数组
	 */
	flatten(arr) {
		return !Array.isArray(arr) ? arr : [].concat.apply([], arr.map(util.flatten));
	},
	/**
	 * base64转本地图片地址
	 * @param {String} base64 
	 * @return {String} 返回保存的地址
	 */
	base64ToPath(base64){
		return new Promise(function(resolve, reject) {
			let extName = base64.match(/data\:\S+\/(\S+);/)
			if (extName) {
				extName = extName[1]
			} else {
				reject(new Error('base64 error'))
			}
			let fileName = Date.now() + '.' + extName
			if (typeof plus === 'object') {
				let bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
				bitmap.loadBase64Data(base64, function() {
					let filePath = '_doc/uniapp_temp/' + fileName
					bitmap.save(filePath, {
						quality: 100, // 保存图片的质量 1-100 默认值为50
					}, function() {
						bitmap.clear()
						resolve(filePath)
					}, function(error) {
						bitmap.clear()
						reject(error)
					})
				}, function(error) {
					bitmap.clear()
					reject(error)
				})
				return
			}
			reject(new Error('not support'))
		})
	},
	/**
	 * 获取图片资源
	 * @param {String} url 资源路径
	 * @return {String} 返回base64资源内容
	 */
	async getImage(url) {
		let storageImgUrl = url; // 缓存图片地址-解决每次拉取图片会跟时间戳问题
		if (url && url.indexOf(".html?") >= 0) {
			storageImgUrl = url.slice(0, url.indexOf(".html?") + 5);
		}
		
		const storageImg = getApp().globalData.imgData || []; // 获取缓存的图片列表
		return new Promise((resolve, reject) => {
			// 判断图片是否请求过
			const currentStorageImg = storageImg.find(item => item.url === encodeURIComponent(storageImgUrl)); // encodeURIComponent-解决图片路径特殊字符问题
			if (currentStorageImg) {
				resolve(currentStorageImg.imgData);
				return;
			}
			
			// #ifdef APP-PLUS
			let xhr = new plus.net.XMLHttpRequest();
			xhr.timeout = 30000;
			xhr.onloadend = function(){
				if (xhr.status === 200 && xhr.responseText && xhr.responseText.indexOf("molixg:image/") === 0) {
					// 替换自定义字符和换行符 注意：换行符会导致图片不显示
					const imgData = xhr.responseText.replace('molixg:image/', 'data:image/').replace(';molixg', ';base64');
					
					// 直接用base64显示
					// 请求过的图片缓存到全局变量中
					const newStorageImg = getApp().globalData.imgData || [];
					if (!newStorageImg.find(item => item.url === encodeURIComponent(storageImgUrl))) {
						newStorageImg.push({
							url: encodeURIComponent(storageImgUrl),
							imgData
						});
					}
					resolve(imgData);
				} else {
					resolve(util.ImgDefault);
				}
			}
			xhr.open("GET", url);
			xhr.send();
			// #endif
			
			// #ifdef H5
			// const [error, res] = await uni.request({ url: url });
			// if (res && res.data && util.isString(res.data) && res.data.indexOf("molixg:image/") === 0) {
			// 	// 替换自定义字符和换行符 注意：换行符会导致图片不显示
			// 	const imgData = res.data.replace('molixg:image/', 'data:image/').replace(';molixg', ';base64');
				
			// 	// 请求过的图片缓存到全局变量中
			// 	const newStorageImg = getApp().globalData.imgData || [];
			// 	if (!newStorageImg.find(item => item.url === encodeURIComponent(storageImgUrl))) {
			// 		newStorageImg.push({
			// 			url: encodeURIComponent(storageImgUrl),
			// 			imgData
			// 		});
			// 	}
			// 	resolve(imgData);
			// } else {
			// 	resolve(util.ImgDefault);
			// }
			uni.request({
				url: url,
				success: (res) => {
					if (res && res.data && util.isString(res.data) && res.data.indexOf("molixg:image/") === 0) {
						// 替换自定义字符和换行符 注意：换行符会导致图片不显示
						const imgData = res.data.replace('molixg:image/', 'data:image/').replace(';molixg', ';base64');
						
						// 请求过的图片缓存到全局变量中
						const newStorageImg = getApp().globalData.imgData || [];
						if (!newStorageImg.find(item => item.url === encodeURIComponent(storageImgUrl))) {
							newStorageImg.push({
								url: encodeURIComponent(storageImgUrl),
								imgData
							});
						}
						resolve(imgData);
					} else {
						resolve(util.ImgDefault);
					}
				},
				fail: (error) => {
					resolve(util.ImgDefault);
				}
			});
			// #endif
		})
	},
	ImgDefault: '/static/ImgDefault.png', // 图片默认地址
	/**
	 * 版本比较大小
	 * @param {String} preVersion 版本1 1.0.1
	 * @param {String} lastVersion 版本2 1.0.2
	 * @return {Number} 返回 0-相等 1-大于 -1-小于
	 */
	versionCompare(preVersion = '', lastVersion = '') {
		let sources = preVersion.split('.');
		let dests = lastVersion.split('.');
		let maxL = Math.max(sources.length, dests.length);
		let result = 0;
		for (let i = 0; i < maxL; i++) {  
			let preValue = sources.length > i ? sources[i]:0;
			let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
			let lastValue = dests.length > i ? dests[i]:0;
			let lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
			if (preNum < lastNum) {
				result = -1;
				break;
			} else if (preNum > lastNum) { 
				result = 1;
				break;
			}
		}
		return result;
	},
	/**
	 * 打开安卓原生页面
	 */
	openAndroidActivity(activity = '', params = {}) {
		//获取当前Activity
		let main = plus.android.runtimeMainActivity();
		//获取java辅助类  
		let Helper = plus.android.importClass("com.huashizhibo.main.Helper");
		//创建对象实例  
		let mHelper = new Helper();
		//调用java中的跳转方法，并且传入当前activity实例 -- 注参数类型必须严格按照安卓的值类型传
		switch (activity){
			case "startLive": // 立即直播
				mHelper.startLive(main);
				break;
			case "liveUserHome": // 个人主页
				if (params.id) mHelper.liveUserHome(main, parseInt(params.id));
				break;
			case "liveMyDynamic": // 我的动态
				mHelper.liveMyDynamic(main);
				break;
			default:
				mHelper.jump(main);
				break;
		}
	},
}

// 输入校验
const field = {
	//是否有效的用户名
	isValidatedUserName:(username) => {
		var regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,11}$/;
		return regex.test(username);
	},
	//是否有效的密码
	isValidatedPassword:(password) => {
		var regex = /[a-zA-Z0-9]{6,12}$/;
		return regex.test(password);
	},
	//是否为空
	isEmpty:(text) => {
		//如果前后有空格，去掉前后空格；如果全是空格，去掉所有空格
		return (text.trim().length == 0);
	},
	//纯字母
	isOnlyAlpha:(text) => {
		var regex = /[a-zA-Z]+$/;
		return regex.test(text);
	},
	//纯数字
	isOnlyNumeric:(text) => {
		var regex = /[0-9]+$/;
		return regex.test(text);
	},
	//须是字母与数字的组合，默认验证两位及以上
	isAlphaNumeric:(text) => {
		var regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,}$/;
		return regex.test(text);
	},
	//字母、数字或两者的组合
	isAlphaOrNumeric:(text) => {
		var regex = /^[a-zA-Z0-9]+$/;
		return regex.test(text);
	},
	//是否有效的邮箱
	isValidatedEmial:(text) => {
		var regex = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}/;
		return regex.test(text);
	},
	//是否有效的验证码
	isValidatedVCode:(text) => {
		var regex = /[0-9]{4,6}$/;
		return regex.test(text);
	},
	//是否有效的手机号
	isValidatedMobile:(text) => {
		/**
		 * 手机号码:
		 * 13[0-9], 14[5,7], 15[0, 1, 2, 3, 5, 6, 7, 8, 9], 16[6], 17[5, 6, 7, 8], 18[0-9], 170[0-9], 19[89]
		 * 移动号段: 134,135,136,137,138,139,150,151,152,157,158,159,182,183,184,187,188,147,178,1705,198
		 * 联通号段: 130,131,132,155,156,185,186,145,175,176,1709,166
		 * 电信号段: 133,153,180,181,189,177,1700,199
		 */
		var MOBILE = /^1(3[0-9]|4[57]|5[0-35-9]|6[6]|7[05-8]|8[0-9]|9[89])\\d{8}$/;
		
		var CM = /(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478]|9[8])\\d{8}$)|(^1705\\d{7}$)/;
		
		var CU = /(^1(3[0-2]|4[5]|5[56]|66|7[56]|8[56])\\d{8}$)|(^1709\\d{7}$)/;
		
		var CT = /(^1(33|53|77|8[019]|99)\\d{8}$)|(^1700\\d{7}$)/;
		
		return (MOBILE.test(text) || CM.test(text) || CU.test(text) || CT.test(text));
	},
	//是否有效的身份证号
	isValidatedIDCard:(text) => {
		var regex = /^(\\d{14}|\\d{17})(\\d|[xX])$/;
		return regex.test(text);
	},
	//是否有效的车牌号
	isValidatedCarNo:(text) => {
		var regex = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$/;
		return regex.test(text);
	},
	//是否有效的车型
	isValidatedCarType:(text) => {
		var regex = /^[\u4E00-\u9FFF]+$/;
		return regex.test(text);
	},
	//纯中文
	isOnlyChinese:(text) => {
		var regex = /[\u4e00-\u9fa5]+$/;
		return regex.test(text);
	},
	//微信号校验 可以使用6—20个字母、数字、下划线和减号，必须以字母开头
	//是否有效的微信号
	isValidatedWechat:(text) => {
		var regex = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
		return regex.test(text);
	},
	//是否有效的银行卡账号
	isValidatedBankCard:(text) => {
		var regex = /[1-9]([0-9]{13,19})/;
		return regex.test(text);
	},
	//是否包含特殊字符
	isContainIllegalCharacters:(text) => {
		var regex = /^[A-Za-z0-9\\u4e00-\u9fa5]+$/;
		//此处结果取反
		return !regex.test(text);
	},
	//字符长短在start和end之间
	isBetween:(text, start, end) => {
		return (text.length >= start && text.length <= end);
	},
	//输入的数字在min和max之间
	inLimit:(text, min, max) => {
		return (Number(text) >= min && Number(text) <= max);
	},
	//限制 只输入数字 包括不能输入字符和小数点
	//@input="bank.card_number = Utils.number(bank.card_number)" v-model="bank.card_number"
	toNumber:(text, float = false) => {
		text = String(text);
		// float = true 可以输入小数点
		if (float) {
		  return text.replace(/[^\d.]/g, '').replace(/^0{1,}/g,'')
		}else {
		  return text.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')
		}
	},
	/**
	 * 手机脱敏
	 * @param {String} text - 操作的文本
	 * @param {Number} prefix - 前面保留位数
	 * @param {Number} suffix - 后面保留位数
	 * @param {String} maskChar - 替换的符号
	 */
	maskText(text, prefix = 2, suffix = 4, maskChar = '*') {
		const prefixStr = text.slice(0, prefix);
		const suffixStr = text.slice(prefix, text.length);
		return prefixStr + suffixStr.slice(-suffix).padStart(suffixStr.length, maskChar);
	},
}

// 日期处理
const date = {
	// 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
	now() {
		// 补零
		const zeroFill = (i) => {
			if (i >= 0 && i <= 9) {
				return "0" + i;
			}
			return i;
		}
		let date = new Date(); //当前时间
		let month = zeroFill(date.getMonth() + 1); //月
		let day = zeroFill(date.getDate()); //日
		let hour = zeroFill(date.getHours()); //时
		let minute = zeroFill(date.getMinutes()); //分
		let second = zeroFill(date.getSeconds()); //秒
		return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
	},
	// 时间戳格式化 格式：yyyy-MM-dd HH:MM:SS
	timestampToDate(timestamp = +new Date()) {
		// 补零
		const zeroFill = (i) => {
			if (i >= 0 && i <= 9) {
				return "0" + i;
			}
			return i;
		}
		if (timestamp) {
			let time = new Date(timestamp);
			let y = time.getFullYear(); //getFullYear方法以四位数字返回年份
			let M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
			let d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
			let h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
			let m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
			let s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
			return `${y}-${zeroFill(M)}-${zeroFill(d)} ${zeroFill(h)}:${zeroFill(m)}:${zeroFill(s)}`;
		}
		return '';
	},
	// 评论时间计算 刚刚 某分钟前 昨天 前天
	dateDiff(dateTimeStamp) {
		//dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
		let minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
		let hour = minute * 60;
		let day = hour * 24;
		let week = day * 7;
		let halfamonth = day * 15;
		let month = day * 30;
		let now = new Date().getTime(); //获取当前时间毫秒
		console.log(now)
		let diffValue = now - dateTimeStamp; //时间差
	
		if (diffValue < 0) {
			return;
		}
		let minC = diffValue / minute; //计算时间差的分，时，天，周，月
		let hourC = diffValue / hour;
		let dayC = diffValue / day;
		let weekC = diffValue / week;
		let monthC = diffValue / month;
		let result = "";
		if (monthC >= 1 && monthC <= 3) {
			result = " " + parseInt(monthC) + "月前"
		}else if (weekC >= 1 && weekC <= 3) {
			result = " " + parseInt(weekC) + "周前"
		}else if (dayC >= 1 && dayC <= 6) {
			result = " " + parseInt(dayC) + "天前"
		}else if (hourC >= 1 && hourC <= 23) {
			result = " " + parseInt(hourC) + "小时前"
		}else if (minC >= 1 && minC <= 59) {
			result = " " + parseInt(minC) + "分钟前"
		}else if (diffValue >= 0 && diffValue <= minute) {
			result = "刚刚"
		}else {
			// 补零
			const zeroFill = (i) => {
				if (i >= 0 && i <= 9) {
					return "0" + i;
				}
				return i;
			}
			let datetime = new Date();
			datetime.setTime(dateTimeStamp);
			let Nyear = datetime.getFullYear();
			let Nmonth = zeroFill(datetime.getMonth() + 1);
			let Ndate = zeroFill(datetime.getDate());
			let Nhour = zeroFill(datetime.getHours());
			let Nminute = zeroFill(datetime.getMinutes());
			let Nsecond = zeroFill(datetime.getSeconds());
			result = Nyear + "-" + Nmonth + "-" + Ndate
		}
		return result;
	},
	// 时间转化-秒转时分秒
	secondToDate(result, lang = '') {
		var h = Math.floor(result / 3600);
		var m = Math.floor((result / 60 % 60));
		var s = Math.floor((result % 60));
	
		let timeText = "";
		if (lang === 'mm:ss') {
			let mText = (m > 9 ? m : `0${m}`);
			let sText = (s > 9 ? s : `0${s}`);
			return result = mText + ':' + sText;
		}
		if (h > 0) {
			timeText += h + "小时";
		}
		if (m > 0) {
			timeText += m + "分";
		}
		return result = timeText + s + "秒";
	},
	// 时间转化-时分秒转秒
	dateToSecond(result) {
		if (!result) return result;
		const timeLenght = result.split(':');
		let h = 0, m = 0, s = 0;
		if (timeLenght.length > 2) {
			h = parseInt(timeLenght[0]);
			m = parseInt(timeLenght[1]);
			s = parseInt(timeLenght[2]);
		}else if (timeLenght.length > 1) {
			m = parseInt(timeLenght[0]);
			s = parseInt(timeLenght[1]);
		}else {
			s = parseInt(result);
		}
		return (h * 3600) + (m * 60) + s;
	},
}
	
// 日期处理
const number = {
	formatter(value, obj){
		if (!obj) {
			obj = {}
		}
		var numberValue = Number(this.unFormatter(value))
		var stringValue = ''
	
		let afterPoint = 2;
		if (obj.afterPoint >= 0) {
			afterPoint = obj.afterPoint;
		}
		let pointZero = obj.pointZero || true;
		
		numberValue = numberValue.toFixed(afterPoint)
		if (!pointZero) {
			numberValue = Number(numberValue) 
		}
		
		stringValue = String(numberValue);
		
		if (obj.conversion) {
			
			let tmpString = String(numberValue);
			const stringArray = tmpString.split('.');
			tmpString = stringArray[0]
			let length = tmpString.length
			
			//金额简写恢复
			var appendString = "";
			var dividendString = "1";
			
			//当达到千、百万、亿、兆时，使用省略写法（K、M、B、T）
			if (length >= 13) {
				appendString = "T";
				dividendString = "1000000000000";
			}else if (length >= 9) {
				appendString = "B";
				dividendString = "100000000";
			}else if (length >= 7) {
				appendString = "M";
				dividendString = "1000000";
			}else if (length >= 4) {
				appendString = "K";
				dividendString = "1000";
			}
			stringValue = String(parseInt(numberValue/Number(dividendString))).concat(appendString);
		}else if (obj.grouping) {
			
			let tmpString = String(numberValue);
			const stringArray = tmpString.split('.');
			let tmpStr1 = stringArray[0]
			let tmpStr2 = stringArray[1]
			
			let tmpStr = []
			let j = 0
			for (let i=tmpStr1.length-1; i>=0; i--) {
				let string = tmpStr1[i]
				j++
				if (j%4 == 0) {
					tmpStr.push(',')
				}
				tmpStr.push(string)
			}
			
			tmpStr = tmpStr.reverse()
			if (tmpStr2 && tmpStr2.length > 0) {
				tmpStr.push('.')
				tmpStr.push(tmpStr2)
			}
			stringValue = tmpStr.join('')
			
		}
		
		let symbol = obj.symbol || '';
		stringValue = symbol.concat(stringValue);
		
		let prefix = obj.prefix || '';
		stringValue = prefix.concat(stringValue);
		
		return stringValue;
	},
	unFormatter(value){
		
		var stringValue = String(value)
		stringValue = stringValue.replace(/[,]/g, '')
		stringValue = stringValue.replace(/[+-]/g, '')
		stringValue = stringValue.replace(/[R$￥₫₹]/g, '')
	
		var appendString = "";
		var multiplyingString = "1";
		
		//当达到千、百万、亿、兆时，使用省略写法（K、M、B、T）
		if (stringValue.search("T") != -1) {
			appendString = "T";
			multiplyingString = "1000000000000";
		}else if (stringValue.search("B") != -1) {
			appendString = "B";
			multiplyingString = "100000000";
		}else if (stringValue.search("M") != -1) {
			appendString = "M";
			multiplyingString = "1000000";
		}else if (stringValue.search("K") != -1) {
			appendString = "K";
			multiplyingString = "1000";
		}
		
		stringValue = stringValue.replace(appendString, '')
		stringValue = String(Number(stringValue)*Number(multiplyingString))
	
		return stringValue;
	}
}	

export default {
	rootPath,
	api,
	util,
	field,
	date
};
