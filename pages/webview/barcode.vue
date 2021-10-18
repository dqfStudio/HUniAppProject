<template>
	<view>
		<view style="z-index: 9999; position: fixed; top: 0; left: 0; width: 750rpx; background-color: #333333;" :style="{paddingTop: statusBarHeight+'px'}">
			<nav-base title="扫码找回身份" color="#FFFFFF" backgroundColor="#333333" @clickLeft="handleClose" rightText="相册" @clickRight="handleChooseImage"></nav-base>
		</view>
	</view>
</template>

<script>
	import http from '@/utils/request.js';
	import config from '@/utils/config.js';
	import navBase from '@/components/nav-base/nav-base.vue';
	export default {
		components: {
			navBase
		},
		data: function() {
			return {
				statusBarHeight: 0,
			};
		},
		onLoad(option) {
			const deviceInfo = uni.getSystemInfoSync();
			this.winHeight = deviceInfo.windowHeight;
			this.statusBarHeight = deviceInfo.statusBarHeight;
			this.pageHeight = deviceInfo.windowHeight - deviceInfo.statusBarHeight - 44;
			
			this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
				top: `${deviceInfo.statusBarHeight + 44}px`,  
				left: '0px',  
				width: '750rpx',  
				height: `${this.pageHeight}px`,  
				position: 'static',
				frameColor: '#ff7f00',
				scanbarColor: '#ff7f00'
			});
			this.barcode.onmarked = (type, code, file) => {
				// loaded code 
				console.log("onmarked==>", type, code, file)
				if (code) this.qrcodeLogin(code);
			}
			//此处未演示扫码成功回调的地址设置，实际请参考HTML5Plus API自行处理  
			//注意扫码区域需为正方形，否则影响扫码识别率  
			this.$scope.$getAppWebview().append(this.barcode);
			this.barcode.start();
		},
		onHide() {
		},
		methods: {
			handleClose() {
				if (this.barcode) this.barcode.close();
				uni.navigateBack();
			},
			handleChooseImage() {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(JSON.stringify(res.tempFilePaths));
						if (res.tempFilePaths.length > 0) {
							plus.barcode.scan(res.tempFilePaths[0], (type, result) => {
								console.log("Scan success:("+type+")"+result);
								if (result) this.qrcodeLogin(result);
							}, (error) => {
								console.log("Scan failed: "+JSON.stringify(e));
							});
						}
					}
				});
			},
			// 获取二维码接口
			qrcodeLogin(qrcodeText) {
				// 解析二维码中需要的内容
				if (qrcodeText && qrcodeText.indexOf('login=') >= 0 && qrcodeText.split('login=').length > 1) {
					let qrcodeInfo = qrcodeText.split('login=')[1];
					if (qrcodeInfo && qrcodeInfo.indexOf('_') >= 0 && qrcodeInfo.split('_').length == 3) {
						qrcodeInfo = qrcodeInfo.replace(/_/g, '#');
						
						// 判断当身份和当前账号相同时不做任何操作
						const userInfo = this.$store.state.userInfo;
						if (userInfo && userInfo.id && qrcodeInfo === `${userInfo.id}#${userInfo.zb_uid}#${userInfo.invite_code}`) {
							this.handleClose();
							return;
						}
						
						// 执行登陆
						this.$http.post({
							url: config.api.qrcodeLogin,
							data: {
								code_info: qrcodeInfo,
							},
							isLoading: true
						}).then((res) => {
							if (res.data) {
								uni.showToast({
									title: '找回身份成功',
									duration: 2000
								});
								// 更新token
								uni.setStorageSync('token', res.data.token);
								// 保存用户信息
								uni.setStorageSync('userInfo', res.data);
								
								this.$http.post({
									url: config.api.telnetShow
								}).then((tRes) => {})
								
								// 登陆到直播系统
								if (res.data.zb_info && res.data.zb_info.code === 0 && res.data.zb_info.data) {
									const liveUserInfo = res.data.zb_info.data;
									this.$store.commit('setLiveUserInfo', Object.assign({}, liveUserInfo, {mobile: res.data.mobile || ''}));
								}
								
								this.handleClose();
							}
						}).catch((err) => {
							this.handleClose();
							// uni.showModal({
							// 	content: '找回身份失败，请稍后再试',
							// 	showCancel: false,
							// 	confirmText: '知道了',
							// 	confirmColor: '#FF7F00'
							// });
						})
						
						return;
					}
				}
				
				uni.showModal({
					content: '您的身份卡二维码无效',
					showCancel: false,
					confirmText: '知道了',
					confirmColor: '#FF7F00'
				});
				this.handleClose();
			}
		}
	};
</script>

<style lang="scss" scoped>

</style>
