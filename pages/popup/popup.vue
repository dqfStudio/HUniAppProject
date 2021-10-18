<template>
	<view class="popup">
		<!-- 防止弹框关闭出现页面没有返回问题 -->
		<view class="popup-mask" @click="handleMaskClick"></view>
		
		<!-- 公告提示框 -->
		<uni-popup v-if="type==='notice'" ref="modalNotice" @change="handleChangeNotice">
			<view v-if="noticeData.types && noticeData.types===2" class="notice">
				<image class="notice-img" @click="openURL(noticeData.url)" :src="getImageUrl(noticeData.img)" mode="widthFix"></image>
				<view class="notice-opt"><uni-icons type="close" size="40" color="#fff" @click="hidePopupNotice"></uni-icons></view>
			</view>
			<modal-notice v-else @confirm="hidePopupNotice" :contentText="noticeData.content||''"></modal-notice>
		</uni-popup>
		
		<!-- vip过期提示 -->
		<uni-popup v-if="type==='vipExpired'" ref="modalVipExpired" @change="handleChange">
			<modal-ktvip @confirm="toPayVip" :type="2" okText="立即续费" closeText="取消"></modal-ktvip>
		</uni-popup>
		
		<!-- 被限制登录-警告弹框 -->
		<uni-popup v-if="type==='warning'" ref="modalWarning" @change="handleChange">
			<modal-warning @confirm="customerService" :time="time"></modal-warning>
		</uni-popup>
		
		<!-- 升级提示弹框 -->
		<uni-popup v-if="type==='upgrade'" ref="modalUpgrade" @change="handleChange">
			<modal-upgrade @confirm="upgradeOpt" :type="upgradeType" :text="upgradeText"></modal-upgrade>
		</uni-popup>
		
		<!-- 断网提示弹框 -->
		<uni-popup v-if="type==='network'" ref="modalNetwork" @change="handleChange">
			<modal-network @confirm="refreshNetwork"></modal-network>
		</uni-popup>
		
		<!-- 官网弹框 -->
		<uni-popup v-if="type==='gohome'||type==='notice'" ref="modalGohome" @change="handleChangeHome">
			<modal-gohome @confirm="gohomeOpt"></modal-gohome>
		</uni-popup>
		
		<!-- 游戏券弹框 -->
		<!-- <uni-popup v-if="type==='voucher'||type==='gohome'||type==='notice'" ref="modalGameVoucher" @change="handleChange">
			<modal-gameVoucher @confirm="voucherOpt" :money="this.$store.state.userInfo.give_amount / 100"></modal-gameVoucher>
		</uni-popup> -->
		
		<!-- vip要到期提示弹框-只提示5天内到期的 -->
		<uni-popup v-if="type==='vipEnd'" ref="modalVipEndTip" @change="handleChange">
			<modal-dialog okText="立即续费" @confirm="toPayVip" @close="handleMaskClick">
				<view style="display: flex; flex-direction: column; align-items: center; padding-top: 10rpx;">
					<image style="width: 160rpx; height: 140rpx;" src="/static/icon-wallet.png" mode="heightFix"></image>
					<view style="text-align: center;margin-top:30rpx;">
						<text v-if="vipEndDay===0" style="color:#333333;font-size:30rpx;line-height:42rpx;text-align: center;">您的VIP今天到期，</text>
						<text v-else style="color:#333333;font-size:30rpx;line-height:42rpx;text-align: center;">您的VIP还有{{vipEndDay}}天到期，</text>
						<text style="color:#333333;font-size:30rpx;line-height:42rpx;text-align: center;">现在续费白送90天！</text>
					</view>
				</view>
			</modal-dialog>
		</uni-popup>
		
		<!-- 更新绑定提示弹框 -->
		<uni-popup v-if="type==='other'||type==='gohome'||type==='notice'" ref="modalUpdateBindPhone" @change="handleChange">
			<view style="width: 560rpx; background-color: #fff; border-radius: 16rpx;">
				<image style="width: 560rpx; height: 318rpx;" src="/static/modal/bind-bg-0425.png" mode="widthFix"></image>
				<view style="flex-direction: column;">
					<view style="padding-top: 20rpx; padding-bottom: 15rpx; text-align: center; align-items: center;">
						<text style="color:#333333;font-size:36rpx;line-height:50rpx;font-weight:500;">温馨提示</text>
					</view>
					<view style="padding-left: 24rpx; padding-right: 24rpx;">
						<text style="color:#333333;font-size:30rpx;line-height:42rpx;">乐播更新服务器最晚将于5.1日完成，届时老版本将停用，请尽快绑定手机号，以免账号丢失无法找回！</text>
						<text style="color:#333333;font-size:30rpx;line-height:42rpx;">更新后，将生成两个相同APP，您可使用绑定的手机号登录新的乐播APP老的乐播APP将暂停使用！</text>
					</view>
					<view style="text-align: center; align-items: center; padding-top: 30rpx; padding-bottom: 40rpx;">
						<text v-if="!this.$store.state.userInfo.mobile" @click="bindPhone" style="width:336rpx;height:74rpx;line-height:74rpx;background-image:linear-gradient(270deg,#ff7474,#ff3838);border-radius:74rpx;display:inline-block;font-weight:500;color:#ffffff;font-size:36rpx;text-align: center;">立即绑定</text>
						<text v-else @click="handleMaskClick" style="width:336rpx;height:74rpx;line-height:74rpx;background-image:linear-gradient(270deg,#ff7474,#ff3838);border-radius:74rpx;display:inline-block;font-weight:500;color:#ffffff;font-size:36rpx;text-align: center;">知道了</text>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 进入直播房弹框 -->
		<uni-popup v-if="type==='checkLiveRoom'" ref="modalLiveRoom" @change="handleChange">
			<modal-dialog v-if="+liveRoomData.type===1" @confirm="checkLivePwd">
				<view style="display: flex; flex-direction: column; justify-content: center;">
					<text style="margin: 10rpx 0; font-size: 32rpx; font-weight: bold; text-align: center;">提示</text>
					<text style="margin-bottom: 20rpx; font-size: 28rpx; text-align: center;">请输入房间密码</text>
					<input style="border: solid 1px #eee; height: 60rpx; border-radius: 10rpx; width: 460rpx;" password="true" focus v-model="roomPwd" @input="handlePwd" />
				</view>
			</modal-dialog>
			<modal-dialog v-else @confirm="roomCharge">
				<view style="display: flex; flex-direction: column; justify-content: center;">
					<text style="margin: 10rpx 0; font-size: 32rpx; font-weight: bold; text-align: center;">提示</text>
					<text style="margin-bottom: 20rpx; font-size: 28rpx; text-align: center;">{{liveRoomData.typeMsg}}</text>
				</view>
			</modal-dialog>
		</uni-popup>
		
		<!-- 图片预览弹框 -->
		<uni-popup ref="modalPreviewImage" v-if="type==='previewImage'" @change="handleChange">
			<modal-previewImage :data="previewImageData" :index="previewImageIndex"></modal-previewImage>
		</uni-popup>
	</view>
</template>

<script>
	import http from '@/utils/request.js';
	import config from '@/utils/config.js';
	import modalNotice from '@/components/modal/modal-notice.vue';
	import modalKtvip from '@/components/modal/modal-ktvip.vue';
	import modalWarning from '@/components/modal/modal-warning.vue';
	import modalUpgrade from '@/components/modal/modal-upgrade.vue';
	import modalNetwork from '@/components/modal/modal-network.vue';
	import modalGohome from '@/components/modal/modal-gohome.vue';
	import modalGameVoucher from '@/components/modal/modal-gameVoucher.vue';
	import modalDialog from '@/components/modal/modal-dialog.vue';
	import modalPreviewImage from '@/components/modal/modal-previewImage.vue';
	import md5 from '@/components/js_sdk/js-md5/build/md5.min.js';
	/**
	 * 公用全局弹框-以打开页面的形式展示
	 * 参数 type 代表显示弹框类型 需于onReady设置的相对应
	 */
	export default {
		components: {
			modalNotice,
			modalKtvip,
			modalWarning,
			modalUpgrade,
			modalNetwork,
			modalGohome,
			modalGameVoucher,
			modalDialog,
			modalPreviewImage
		},
		data: function() {
			return {
				sourceData: [],
				noticeData: {}, // 公告信息
				time: 0, // 封禁剩余时间
				upgradeUrl: '', // 升级Url
				upgradeType: 0, // 升级类型 1-app壳子 2-小程序
				upgradeText: '', // 更新描述
				vipEndDay: 0, // 会员到期天数
				liveRoomData: {}, // 直播间数据
				roomPwd: '',
				previewImageData: [], // 预览图片数据
				previewImageIndex: 0, // 预览图片第一次显示索引
			};
		},
		onLoad(option) {
			// const deviceInfo = uni.getSystemInfoSync(); // 获取设备信息
			// this.isAndroid = deviceInfo.platform === 'android'; // 是否是安卓环境
			// if (this.isAndroid) {
			// 	// 安卓环境-当版本小于1.0.17时 显示 更新绑定提示弹框
			// 	this.isModalUpdateBindPhone = config.util.versionCompare(plus.runtime.version, '1.0.17') === -1;
			// }
			
			// 弹框类型
			this.type = option && option.type || '';
			if (option && option.data && this.type === 'notice') {
				this.sourceData = JSON.parse(option.data);
				this.noticeData = this.sourceData[0];
				if (this.noticeData && this.noticeData.types && this.noticeData.types===2) {
					this.requestImageUrl(this.noticeData, 'img');
				}
				this.sourceData.splice(0,1);
			} else if (option && option.time && this.type === 'warning') {
				this.time = option.time; //封禁剩余时间
			} else if (option && option.upgradeType && this.type === 'upgrade') {
				this.upgradeUrl = option.upgradeUrl || ''; // 下载地址
				this.upgradeType = parseInt(option.upgradeType) || 0; // 升级类型 1-app壳子 2-小程序 
				this.upgradeText = option.upgradeText || ''; // 更新描述
			} else if (option && option.liveRoomData && this.type === 'checkLiveRoom') {
				this.liveRoomData = JSON.parse(option.liveRoomData);
			} else if (option && this.type === 'previewImage') {
				this.previewImageData = getApp().globalData.previewImageData || [];
				this.previewImageIndex = option.index || 0;
			}
		},
		onReady() {
			switch (this.type){
				case 'notice': // 公告弹框
					// this.$refs.modalNotice.open();
					// #ifdef APP-PLUS
					if (uni.getStorageSync(`isHideModalGohome_${this.$store.state.userInfo.id}`)) {
						this.$refs.modalNotice.open();
					} else {
						this.$refs.modalGohome.open();
					}
					// #endif
					
					// #ifdef H5
					this.$refs.modalNotice.open();
					// #endif
					
					break;
				case 'vipExpired': // 会员过期提示弹框
					this.$refs.modalVipExpired.open();
					break;
				case 'warning': // 被限制登录-警告弹框
					this.$refs.modalWarning.open();
					break;
				case 'upgrade': // 升级提示弹框
					this.$refs.modalUpgrade.open();
					break;
				case 'network': // 断网提示弹框
					this.$refs.modalNetwork.open();
					break;
				case 'gohome': // 官网弹框
					this.$refs.modalGohome.open();
					break;
				case 'voucher': // 游戏券弹框
					// this.$refs.modalGameVoucher.open();
					break;
				case 'vipEnd': // vip要到期提示弹框
					const vipEndDate = config.util.timestampFormat(this.$store.state.userInfo.effective_at).slice(0,10).replace(/-/g,'/');
					const currentServerDate = config.util.timestampFormat(uni.getStorageSync('serverTime')).slice(0,10).replace(/-/g,'/');
					this.vipEndDay = parseInt((new Date(vipEndDate) - new Date(currentServerDate)) / (1000 * 60 * 60 * 24));
					
					this.$refs.modalVipEndTip.open();
					uni.setStorageSync(`modalVipEndTipTime-${this.$store.state.userInfo.id}`, uni.getStorageSync('serverTime')||''); // 记录打开时间-使用服务器时间-根据不同的用户记录
					break;
				case 'other': // 更新绑定提示弹框
					this.$refs.modalUpdateBindPhone.open();
					break;
				case 'checkLiveRoom': // 进入直播房间
					this.$refs.modalLiveRoom.open();
					break;
				case 'previewImage': // 图片预览
					this.$refs.modalPreviewImage.open();
					break;
				default:
					break;
			}
		},
		onBackPress(e) {
			if (e.from === 'navigateBack') {
				return false;
			}
			return true;
		},
		methods: {
			handlePwd(event) {
				this.roomPwd = event.target.value;
			},
			// 验证码密码是否正确
			checkLivePwd() {
				if (!this.roomPwd) return;
				if (this.liveRoomData.typeMsg === md5(this.roomPwd)) {
					// 进入房间
					const liveEnterRoom = getApp().globalData.liveEnterRoom;
					uni.showLoading({
					  title: '正在进入...',
						mask: true,
						complete: () => {
							setTimeout(function () {
							   uni.hideLoading();
							}, 5000);
						}
					});
					if (uni.getSystemInfoSync().platform === "android") {
						//安卓打开原生页面 执行跳转
						uni.sendNativeEvent("killLivePage", {}, ret => {
							this.$config.util.openAndroidActivity("liveEnterRoom", liveEnterRoom);
							uni.hideLoading();
						});
						uni.navigateBack();
					} else {
						// ios 发送事件执行跳转
						uni.sendNativeEvent("liveEnterRoom", liveEnterRoom, ret => {});
						uni.navigateBack();
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '密码错误'
					});
				}
			},
			// 房间扣费
			async roomCharge() {
				let roomChargeResult = await this.$http.live.post({
				  url: this.$config.liveApi.liveRoomCharge,
				  data: {
				    uid: this.$store.state.liveUserInfo.id,
				    token: this.$store.state.liveUserInfo.token,
						liveuid: this.liveRoomData.uid,
						stream: this.liveRoomData.stream
				  }
				});
				// 扣费成功
				if (roomChargeResult.code === 0) {
					// 进入房间
					const liveEnterRoom = getApp().globalData.liveEnterRoom;
					uni.showLoading({
					  title: '正在进入...',
						mask: true,
						complete: () => {
							setTimeout(function () {
							   uni.hideLoading();
							}, 5000);
						}
					});
					if (uni.getSystemInfoSync().platform === "android") {
						//安卓打开原生页面 执行跳转
						uni.sendNativeEvent("killLivePage", {}, ret => {
							this.$config.util.openAndroidActivity("liveEnterRoom", liveEnterRoom);
							uni.hideLoading();
						});
						uni.navigateBack();
					} else {
						// ios 发送事件执行跳转
						uni.sendNativeEvent("liveEnterRoom", liveEnterRoom, ret => {});
						uni.navigateBack();
					}
				}
			},
			// 当没有图片返回默认图片 url 资源路径
			getImageUrl(url = '') {
				if (url.indexOf('.html') >= 0) return config.util.ImgDefault;
				return url || config.util.ImgDefault;
			},
			/**
			 * 获取图片资源-解决异步问题
			 * @param {Object} imgData 图片数据源对象
			 * @param {String} key 图片数据源对应key
			 */
			requestImageUrl(imgData = {}, key = 'image') {
				if (imgData && imgData[key] && imgData[key].indexOf('.html') >= 0) {
					// 获取图片地址
					config.util.getImage(imgData[key]).then(data => {
						imgData[key] = data;
					});
				}
			},
			handleMaskClick() {
				uni.navigateBack();
			},
			// 开通vip
			toPayVip() {
				config.util.openURL('/pages/user/voucherCenter/voucherCenter', 1);
			},
			// 打开链接
			openURL(url) {
				config.util.openURL(url);
			},
			// 监听公告弹框显示隐藏
			handleChangeNotice(e) {
				// 判断是关闭时，判断是否有需要继续显示的公告
				if (!e.show && this.sourceData.length === 0) {
					uni.navigateBack();
				} else if (!e.show && this.sourceData.length > 0) {
					// 判断还有需要显示的公告
					setTimeout(() => {
						this.noticeData = this.sourceData[0];
						if (this.noticeData && this.noticeData.types &&  this.noticeData.types===2) {
							this.requestImageUrl(this.noticeData, 'img');
						}
						this.$refs.modalNotice.open();
						this.sourceData.splice(0,1);
					},350)
				}
			},
			// 关闭公告弹框
			hidePopupNotice() {
				this.$refs.modalNotice.close();
			},
			handleChange(e) {
				// 判断是关闭时
				if (!e.show) {
					uni.navigateBack();
				}
			},
			// 联系客服
			customerService() {
				const userInfo = this.$store.state.userInfo;
				config.util.openURL(`${userInfo.customer_url}&id=${userInfo.zb_liang || userInfo.zb_uid || userInfo.id}&yhtyun=${userInfo.user_login||''}`, -1);
			},
			// 升级操作
			upgradeOpt() {
				if (this.upgradeType === 1 && this.upgradeUrl) {
					this.openURL(this.upgradeUrl);
				} else if (this.upgradeType === 2) {
					// plus.runtime.restart();
				}
			},
			// 重新获取网络
			refreshNetwork() {
				uni.getNetworkType({
					complete: (res) => {
						if (res.networkType !== 'none' && res.networkType !== 'unknown') {
							// 用于测试网络链接是否真实
							http.get({
								baseUrl: 'https://www.baidu.com/',
								url: ''
							}).then((ret)=>{
								uni.showToast({
									icon: 'none',
									title: '网络不可用'
								});
							}).catch((err) => {
								if (err && err.statusCode === 200) {
									// 网络通了
									this.$refs.modalNetwork.close();
									
									const tempNoNetworkRequest = uni.getStorageSync('tempNoNetworkRequest') || [];
									tempNoNetworkRequest.map(item => http.request(item));
								} else {
									uni.showToast({
										icon: 'none',
										title: '网络不可用'
									});
								}
							})
						} else {
							// 网络不通
							uni.showToast({
								icon: 'none',
								title: '网络不可用'
							});
						}
					}
				});
			},
			// 监听官网弹框关闭
			handleChangeHome(e) {
				if (!e.show && (!this.noticeData || JSON.stringify(this.noticeData) === "{}")) {
					uni.navigateBack();
				} else if (!e.show && this.noticeData && JSON.stringify(this.noticeData) !== "{}") {
					setTimeout(() => {
						this.$refs.modalNotice.open();
					},350);
				}
			},
			// 监听官网弹框操作
			gohomeOpt() {
				if (this.sourceData.length === 0 && !this.noticeData) {
					uni.navigateBack();
				} else {
					this.$refs.modalGohome.close();
				}
			},
			// 监听游戏券弹框关闭
			voucherOpt() {
				const userInfo = this.$store.state.userInfo;
				const liveUserInfo = this.$store.state.liveUserInfo;
				const url = `${userInfo.customer_url}&id=${userInfo.zb_liang || userInfo.zb_uid || userInfo.id}&yhtyun=${userInfo.user_login||''}`;
				uni.redirectTo({
					url: '/pages/webview/webview?url=' + encodeURIComponent(url)
				});
			},
			// 绑定手机
			bindPhone() {
				config.util.openURL('/pages/user/bindPhone/bindPhone', 1);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.popup-mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0);
	}
	.notice {
		width: 580rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
	}
	.notice-img {
		width: 580rpx;
	}
	.notice-opt {
		margin-top: 20rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
	}
</style>