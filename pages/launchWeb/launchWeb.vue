<template>
	<view class="launchWeb" v-bind:style="{minHeight:WinHeight + 'px' }">
		<image class="launchWebImg" :src="advertsImg" mode="aspectFill" @click="goWeb"></image>
		<!-- <view v-if="time>0" class="launchTime">
			<span style="font-weight: bold;padding-right: 5px;">{{time}}</span>
			<span class="partitionSpan">|</span>
			<span>秒</span>
		</view> -->
		<view v-if="time===0" class="launchTime" @click="skip" :style="{top:statusBarHeight+'px'}">
			<span>进入</span>
		</view>
	</view>
</template>

<script>
	import config from '@/utils/config.js'
	export default {
		data: function() {
			return {
				time: -1,
				WinHeight: "",
				advertsImg: "", // /static/launchBg.png
				advertsUrl: "",
				advertImgStatus: 0,
				statusBarHeight: 0,
			};
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			const deviceInfo = uni.getSystemInfoSync();
			this.statusBarHeight = deviceInfo.statusBarHeight;
			this.WinHeight = uni.getSystemInfoSync().windowHeight;
			// this.getAdvert();
			
			// #ifdef APP-PLUS
			this.getServerUrl().then((data) => {
				// 账号授权
				this.getAuth();
			})
			// #endif
			
			// #ifdef H5
			sessionStorage.isStarted = true; // 是否启动过，用于判断是否第一次进入
			// 账号授权
			this.getAuth();
			// #endif
		},
		// onShow() {
		// 	if (this.time > 0 && this.countDownTime) {
		// 		this.countDown();
		// 	}
		// },
		// onHide() {
		// 	if (this.countDownTime) {
		// 		clearInterval(this.countDownTime)
		// 	}
		// },
		// onUnload() {
		// 	if (this.countDownTime) {
		// 		clearInterval(this.countDownTime)
		// 	}
		// },
		onBackPress(e) {
			return true;
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
							uni.setStorageSync('iosVersion', ret.version || ''); // 获取ios手动设置的版本号
							uni.setStorageSync('baseServerUrl', ret.url); // 点播接口地址
							// 直播接口地址
							let liveBaseServerUrl = "";
							const httpProtocol = `${ret.url.split('://')[0]}://`;
							let httpHost = ret.url.split('://')[1];
							if (httpHost.split('.').length === 2) {
								liveBaseServerUrl = `${httpProtocol}live.${httpHost}`;
							} else if (httpHost.split('.').length === 3 && !/^\d+$/.test(httpHost.split('.')[0]) && !/^\d+$/.test(httpHost.split('.')[1]) && !/^\d+$/.test(httpHost.split('.')[2])) {
								liveBaseServerUrl = `${httpProtocol}live.${httpHost.split('.')[1]}.${httpHost.split('.')[2]}`;
							}
							uni.setStorageSync('liveBaseServerUrl', liveBaseServerUrl);
							
							resolve(ret);
						}
						resolve('');
					})
				})
			},
			// 授权
			getAuth() {
				this.$http.post({
					url: config.api.auth
				}).then((resA) => {
					if (resA.data) {
						uni.setStorageSync('token', resA.data.token || '');
						// 获取后台生成的uuid 解决收的手机获取不到uuid
						if (resA.data.udid) {
							uni.setStorageSync('uuid', resA.data.udid);
						}
						
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
								// this.logged = resT.data.time
								uni.setStorageSync('key_time', resT.data.time);
								console.log(resT.data.time)
							}
						})
						
						// setTimeout(() => {
						// 	this.getAdvert();
						// }, 2000);
						this.time = 0;
						this.getAdvert();
						
						// 获取乐鱼地址
						// this.$store.dispatch('getUserInfo').then(() => {
						// 	this.advertsUrl = this.$store.state.userInfo.game_jump_url || 'https://leyu1028.com/entry/register/?i_code=6555988';
						// });
						this.$store.dispatch('getUserInfo');
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
					if (err.data && [500,1000,1001,1002,1003,1004].includes(err.data.code)) return;
					
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
			// 去网站
			goWeb() {
				if (this.advertId) {
					this.$http.post({
						url: config.api.clickVolume,
						data: {
							advert_id: this.advertId
						}
					})
				}
				if (this.advertsUrl) {
					// #ifdef APP-PLUS
					plus.runtime.openURL(this.advertsUrl)
					// #endif
					
					// #ifdef H5
					// #endif
				}
			},
			// 倒计时
			countDown() {
				this.countDownTime = setInterval(() => {
					this.time--;
					if (this.time <= 0) {
						this.time = 0;
						clearInterval(this.countDownTime);
						// // 判断用户是否被封禁
						// const pages = getCurrentPages();
						// const page = pages[pages.length - 1];
						// // #ifdef APP-PLUS
						// const currentWebview = page.$getAppWebview();
						// if (page && page.route !== 'pages/popup/popup') {
						// 	this.skip();
						// }
						// // #endif
					}
				}, 1000);
			},
			// 去首页
			skip() {
				if (this.countDownTime) {
					clearInterval(this.countDownTime)
				}
                uni.navigateTo({
                    url: "/pages/home/index"
                })
			},
			getAdvert() {
				this.$http.post({
					url: config.api.startAdvert
				}).then((res) => {
					uni.hideLoading();
					if (res.data && res.data.start_ad) {
						this.advertId = res.data.start_ad.aid;
						// this.time = res.data.show_time;
						this.advertsUrl = res.data.start_ad.url;
						// this.advertsImg = res.data.start_ad.image;
						if (res.data.start_ad.image.indexOf('.html') >= 0) {
							// 获取图片地址
							config.util.getImage(res.data.start_ad.image).then(data => {
								this.advertsImg = data;
							})
						} else {
							this.advertsImg = res.data.start_ad.image;
						}
					}
					// this.countDown();
				}).catch((err) => {
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					setTimeout(() => {
						this.getAdvert();
					}, 3000);
				})
			},
		}
	}
</script>

<style>
	.launchWeb {
		height: 100%;
		width: 750rpx;
		position: relative;
		background: url('/static/launchBg.png') no-repeat center/cover;
	}

	.launchWebImg {
		height: 100%;
		width: 100%;
		position: absolute;
	}

	.launchTime {
		background-color: rgba(0,0,0,.5);
		width: 150rpx;
		height: 80rpx;
		border-radius: 45%;
		position: absolute;
		right: 30rpx;
		top: 0;
		text-align: center;
		margin-top: 20rpx;
	}

	.launchTime span {
		font-size: 36rpx;
		line-height: 80rpx;
		color: #FFFFFF;
		font-weight: 500;
	}

	.partitionSpan {
		margin: 0 6rpx;
	}
</style>
