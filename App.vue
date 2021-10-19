<script>
	import config from '@/utils/config.js'
	import http from '@/utils/request.js'
	export default {
		globalData: {
			loginInvalidIsShow: false, // 是否显示登录失效提示
			imgData: [], // 缓存图片-避免重复请求
		},
		onLaunch: function() {
			console.log('App Launch')
			//监听tabbar中间按钮minButton点击事件
			uni.onTabBarMidButtonTap(() => {
				uni.navigateTo({
					url: '/pages/index/homePage4'
				})
			})
			
			
			// #ifdef APP-PLUS
			
			// 锁定只能竖屏
			plus.screen.lockOrientation('portrait-primary');
			
			// 解决安卓小程序切换到后台显示白屏问题 
			// 解决方法 安卓设置初始启动次数“isEnterPage”为1，当监听小程序被关闭启动次数加1，小程序判断启动次数大于1时需自动重启且设置启动次数为1
			if (uni.getSystemInfoSync().platform === "android") {
				this.getServerUrl().then((data) => {
					// 判断小程序
					if (data && data.isEnterPage && parseInt(data.isEnterPage) > 1) {
						// 设置启动次数为1
						this.setIsEnterPage().then((seData) => {
							if (seData && seData.code === 0) {
								// 设置成功 重新启动
								plus.runtime.restart();
							}
						});
					}
				})
			}
			
			// 监听接收到宿主App消息
			uni.onNativeEventReceive((event, data)=>{
				switch (event){
					case 'toPage': // 进入页面
						if (data && data.url) {
							// 判断是否是登录失效
							if (data.url.indexOf('type=loginInvalid') >= 0) {
								uni.$emit('handleGlobalEvent', {type: 'loginInvalid'});
							}
							
							// tabbar页面
							const tabBarPageArr = [
								'pages/home/index', 
								'pages/game/index', 
								'pages/live/index', 
								'pages/square/index', 
								'pages/user/index'
							];
							//  获取当前页面
							const pages = getCurrentPages();
							const page = pages[pages.length - 1];
							const currentRoute = `/${(page && page.route) || ''}`;
							if (currentRoute !== data.url) {
								if (tabBarPageArr.find(item => data.url.indexOf(item) >= 0)) {
									// uni.switchTab({
									//    url: data.url,
									// 	 animationType: 'none'
									// });
									uni.navigateTo({
									    url: data.url,
									    animationType: 'none'
									})
								} else if (tabBarPageArr.find(item => currentRoute.indexOf(item) >= 0)) {
									uni.navigateTo({
									   url: data.url,
										 animationType: 'none'
									});
								} else {
									if (uni.getSystemInfoSync().platform === "android") {
										uni.redirectTo({
										  url: data.url
										});
									} else {
										uni.navigateTo({
										   url: data.url,
											 animationType: 'none'
										});
									}
								}
							}
						}
						break;
					case 'userLoginLive': // 用户登陆直播
						this.showWaiting = plus.nativeUI.showWaiting("重新登录中", {
							width: '120px',
							height: '100px',
							size: '14px'
						});
						this.getAuth();
						break;
					default:
						break;
				}
			});
			
			// #endif
			
			// #ifdef H5
			// 判断用户是否第一次进入
			const tabBarPageArr = [
				'/pages/home/index', 
				'/pages/game/index', 
				'/pages/live/index', 
				'/pages/square/index', 
				'/pages/user/index'
			];
			if (this.$route.path !== '/' && !sessionStorage.isStarted) {
				window.location.href = "/";
			} else if (this.$route.path !== '/' && !uni.getStorageSync('token')) {
				window.location.href = "/";
			} else if (this.$route.path !== '/' && !tabBarPageArr.includes(this.$route.path)) {
				window.location.href = "/";
			}
			// #endif
			
			// 全局事件监听
			uni.$on('handleGlobalEvent', (data) => {
				console.log('监听到事件来自 handleGlobalEvent ，携带参数 type 为：' + data.type, getApp().globalData.loginInvalidIsShow);
				
				if (data && data.type && data.type === 'updateUserInfo') {
					// 更新个人信息
					this.$store.dispatch('getUserInfo');
				} else if (data && data.type && data.type === 'loginInvalid' && !getApp().globalData.loginInvalidIsShow) {
					getApp().globalData.loginInvalidIsShow = true;
					
					// #ifdef APP-PLUS
					// 用户登陆失效
					uni.showModal({
						title: '提示',
						content: '你的登录状态失效，请重新登录',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.showWaiting = plus.nativeUI.showWaiting("重新登录中", {
									width: '120px',
									height: '100px',
									size: '14px'
								});
								this.getAuth();
								// uni.navigateTo({
								//    url: "/pages/user/login/index",
								// });
								
								getApp().globalData.loginInvalidIsShow = false;
							} else if (res.cancel) {
								// 改变为游客
								this.showWaiting = plus.nativeUI.showWaiting("重新登录中", {
									width: '120px',
									height: '100px',
									size: '14px'
								});
								this.getAuth();
								// uni.navigateTo({
								//    url: "/pages/user/login/index",
								// });
								getApp().globalData.loginInvalidIsShow = false;
							}
						}
					});
					// #endif
					
					// #ifdef H5
					// this.getAuth();
					// getApp().globalData.loginInvalidIsShow = false;
					uni.showModal({
						title: '提示',
						content: '你的登录状态失效，请重新登录',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								// this.getAuth();
								// uni.navigateTo({
								//    url: "/pages/user/login/index",
								// });
								// getApp().globalData.loginInvalidIsShow = false;
								window.location.replace('/');
								// this.openURL('/pages/user/login/index');
							}
						}
					});
					// #endif
				} 
			});
		},
		onShow: function() {
			console.log('App Show')
			// 判断第一次启动不执行请求
			if (this.firstAppOnShow) {
				if (uni.getStorageSync('baseServerUrl')) {
					http.post({
						url:config.api.telnetShow
					}).then((res)=>{
						if(res.code=="0"){
							uni.setStorageSync('key_time', res.data.time);
							console.log(res.data.time)
						}
					})
				}
			} else {
				this.firstAppOnShow = 1;
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 获取服务端请求地址
			getServerUrl() {
				return new Promise((resolve, reject) => {
					// 解决当app没有接受事件处理
					const setTimeoutGetServerUrl = setTimeout(() => {
						clearTimeout(setTimeoutGetServerUrl);
						resolve('');
					}, 5000);
					
					uni.sendNativeEvent('getServerUrl', {isFirst: true}, ret => {
						if (setTimeoutGetServerUrl) clearTimeout(setTimeoutGetServerUrl);
						if (ret && ret.code === 0 && ret.url) {
							uni.setStorageSync('baseServerUrl', ret.url);
							resolve(ret);
						}
						resolve('');
					})
				})
			},
			// 设置启动小程序次数到初始状态
			setIsEnterPage() {
				return new Promise((resolve, reject) => {
					// 解决当app没有接受事件处理
					const setIsEnterPage = setTimeout(() => {
						clearTimeout(setTimeoutGetServerUrl);
						resolve('');
					}, 3000);
					
					// 设置启动小程序次数为1
					uni.sendNativeEvent('setIsEnterPage', {value: 1}, ret => {
						if (setIsEnterPage) clearTimeout(setIsEnterPage);
						if (ret && ret.code === 0) {
							resolve(ret);
						}
						resolve('');
					})
				})
			},
			// 授权
			getAuth() {
				http.post({
					url: config.api.auth
				}).then((resA) => {
					if (resA.data) {
						uni.setStorageSync('token', resA.data.token || '');
						// 获取后台生成的uuid 解决收的手机获取不到uuid
						if (resA.data.udid) {
							uni.setStorageSync('uuid', resA.data.udid);
						}
						// 更新用户信息
						this.$store.dispatch('getUserInfo');
						// 获取直播相关配置信息
						this.$store.dispatch('getHomeGetConfig');
						
						// 登陆到直播系统
						if (resA.data.zb_info && resA.data.zb_info.code === 0 && resA.data.zb_info.data) {
							const liveUserInfo = resA.data.zb_info.data;
							this.$store.commit('setLiveUserInfo', Object.assign({}, liveUserInfo, {mobile: resA.data.mobile || ''}));
							// this.$jim.login(liveUserInfo.id);
						}
						
						this.$http.post({
							url: config.api.telnetShow
						}).then((resT) => {
							if(resT.code=="0"){
								uni.setStorageSync('key_time', resT.data.time);
							}
						})
						
						// 关闭授权加载中
						if(this.showWaiting) this.showWaiting.close();
						
						// 页面重新加载
						uni.$emit('pageReload');
					} else {
						uni.showLoading({
							title: '加载中',
							mask: true
						});
						setTimeout(() => {
							this.getAuth();
						}, 3000);
					}
				}).catch((err) => {
					// 用户更新/用户封禁 需要弹提示框
					if (err.data && [1001,1002,1003].includes(err.data.code)) return;
					
					uni.getNetworkType({
						complete: (resNet) => {
							console.log(resNet.networkType);
							uni.showModal({
								title: '提示',
								content: '请检查您的网络是否连接',
								showCancel: false,
								confirmText: '重新加载',
								success: (res) => {
									uni.showLoading({
										title: '加载中',
										mask: true
									});
									setTimeout(() => {
										this.getAuth();
									}, 3000);
								}
							});
						}
					});
				})
			},
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
