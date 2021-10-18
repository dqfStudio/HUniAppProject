<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/down-bg.png" mode="aspectFill"></image>
		<image class="modal-icon" src="/static/modal/down-icon.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-head">
					<template v-if="!isCharge">
						<view class="head-row" v-if="coupon>0">
							<text class="head-text1">优先使用下载卷：{{coupon}}/{{sumcoupon}}</text>
						</view>
						<view class="head-row" v-if="coupon<=0">
							<text class="head-text1"> 开通VIP每日领取下载卷：</text>
							<text class="head-text2" @click="onClickReceive">领取</text>
						</view>
					</template>
				</view>

				<!-- <view class="modal-content-row">
					<view :class="flag_size==480 ? 'modal-standard choice_Aflg':'modal-standard choice_Bflg'" @click="flag_size=480">
						<text style="font-size: 28rpx; padding-top: 50rpx;">标清</text>
						<text class="modal-size">(50MB)</text>
						<image v-if="flag_size==480" class="modal_gou" src="/static/modal/gougou.png" mode="aspectFill"></image>
					</view>
					<view :class="flag_size==1080 ? 'modal-standard choice_Aflg':'modal-standard choice_Bflg'" @click="handelFlagSize(1080)">
						<text style="font-size: 28rpx; padding-top: 50rpx;">高清</text>
						<text class="modal-size">(125MB)</text>
						<image v-if="flag_size==1080" class="modal_gou" src="/static/modal/gougou.png" mode="aspectFill"></image>
					</view>
					<view :class="flag_size==20000 ? 'modal-standard choice_Aflg':'modal-standard choice_Bflg'" @click="handelFlagSize(20000)">
						<text style="font-size: 28rpx; padding-top: 50rpx;">超清</text>
						<text class="modal-size">(240MB)</text>
						<text class="modal-exclusive">vip专享画质</text>
						<image v-if="flag_size==20000" class="modal_gou" src="/static/modal/gougou.png" mode="aspectFill"></image>
					</view>

				</view> -->
				<text class="modal_botton">当前余额：{{(balance/100).toFixed(2)}} 金币</text>
			</view>
			<!-- 没有下载券 且 余额不足 -->
			<view v-if="type===0" class="modal-opt" style="justify-content:center;">
				<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
					<text class="modal-opt-btn-text">余额不足</text>
				</view>
			</view>
			<!-- 有下载券 或 余额足 -->
			<view v-else-if="type===1||type===2||type===3" class="modal-opt">
				<view class="modal-opt-btn" @click="close">
					<text class="modal-opt-btn-text">{{closeText}}</text>
				</view>
				<view class="modal-opt-btn modal-opt-btn-ok" @click="onOk">
					<text class="modal-opt-btn-text" v-if="coupon>0">{{okText}}</text>
					<text class="modal-opt-btn-text" v-else="coupon<=0">{{((type===2?vipMoney:money)/100).toFixed(2)}}</text>
				</view>
			</view>
			
			<!-- 对话框 -->
			<view class="modal-prompt" v-if="type===2||type===3">
				<image src="/static/modal/down-tishi.png" mode="heightFix" class="modal-prompt-img"></image>
				<text class="modal-prompt-text" v-if="type===2">VIP已减{{((money-vipMoney)/100).toFixed(2)}}金币</text>
				<text class="modal-prompt-text" v-else="type===3">VIP立减{{((money-vipMoney)/100).toFixed(2)}}金币</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalCache",
		props: {
			isVip: {
				type: Boolean,
				default: false
			},
			isCharge: { // 是否是收费视频
				type: Boolean,
				default: false
			},
			money: {
				type: Number,
				default: 0
			},
			vipMoney: {
				type: Number,
				default: 0
			},
			balance: { // 用户余额
				type: Number,
				default: 0
			},
			okText: {
				type: String,
				default: '确定'
			},
			closeText: {
				type: String,
				default: '取消'
			},
			coupon: { // 下载券剩余次数
				type: Number,
				default: 0
			},
			sumcoupon: { // 下载券总次数
				type: Number,
				default: 0
			},
			/**
			 * type 类型 0- 余额不足-下载券用完 1-下载券未用完 2-VIP 下载券用完-余额足 3-非VIP 下载券用完-余额足
			 */
			type: {
				type: Number,
				default: 0,
			},

			/**
			 * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				flag_size: 1080, // 清晰度 480-标清 1080-高清 20000-超清
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			// this.popup.mkclick = false
			console.log(this.type)
		},
		methods: {
			handelFlagSize(value) {
				this.flag_size = value;
			},
			/**
			 * 点击确认按钮
			 */
			onOk() {
				this.$emit('confirm', this.flag_size, () => {
					this.popup.close()
				})
			},
			/**
			 * 点击取消按钮
			 */
			close() {
				if (this.beforeClose) {
					this.$emit('close', () => {
						this.popup.close()
					})
					return
				}
				this.popup.close()
			},
			// 领取
			onClickReceive() {
				this.$emit('onReceive', () => {
					this.popup.close()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$left: 30rpx;
	$top: 40rpx;

	.modal {
		position: relative;
		width: 642rpx;
		height: 558rpx;
		padding-left: $left;
		padding-right: $left;
		padding-top: $top;
		padding-bottom: $top;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		width: 612rpx;
		height: 518rpx;
		margin-left: -$left;
		margin-top: -$top;
		padding-right: 0;
		padding-bottom: 0;
		/* #endif */
	}

	.modal-bg {
		width: 582rpx;
		height: 478rpx;
	}

	.modal-icon {
		width: 168rpx;
		height: 146rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.modal-view {
		width: 582rpx;
		// height: 658rpx;
		height: 478rpx;
		position: absolute;
		left: $left;
		top: $top;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.modal-content {
		margin-top: 140rpx;
		height: 212rpx;
	}

	.modal-content-row {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-around;

		margin: -34rpx 30rpx 0rpx 30rpx;
	}

	.modal-content-text {
		color: #222222;
		font-size: 28rpx;
		line-height: 50rpx;
		text-align: center;
	}

	.modal-content-head {
		height: 110rpx;
		// justify-content: center;
	}


	.head-text1 {
		font-weight: 500;
		color: #ffffff;
		line-height: 50rpx;
		font-size: 32rpx;
	}

	.head-text2 {
		width: 104rpx;
		border-radius: 11rpx;
		background-color: #5800ff;
		line-height: 44rpx;
		height: 44rpx;
		color: #ffffff;
		text-align: center;
		font-size: 30rpx;
		font-weight:500;
	}

	.head-row {
		margin-top: 5rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.fgx {
		height: 1px;
		background-color: #FFFFFF;
		width: 76rpx;
	}

	.modal-opt {
		padding: 0 30rpx;
		height: 76rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.modal-opt-btn {
		width: 242rpx;
		height: 76rpx;
		border-radius: 76rpx;
		background-color: #c2cce0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;

	}

	.modal-opt-btn-ok {
		background-image: linear-gradient(to right, #ffc400, #ff7f00);
		position: relative;

	}

	.modal-opt-btn-text {
		font-weight: 500;
		color: #ffffff;
		font-size: 32rpx;
	}

	// 缓存代码
	.modal-standard {
		width: 160rpx;
		height: 144rpx;
		flex-direction: column;
		align-items: center;
		// justify-content: center;
		border-width: 1px;
		border-style: solid;
		border-color: rgb(222, 224, 229);
		border-radius: 20rpx;
		// padding-top: 24rpx;
		position: relative;

	}

	.modal-exclusive {
		font-size: 20rpx;
		color: rgba(255, 127, 0, 1);
		padding-top: 5rpx;
	}

	.modal-size {
		font-size: 28rpx !important;
		color: rgba(255, 127, 0, 1);
	}

	.choice_Aflg {
		border-color: #fd7f00;
	}

	.choice_Bflg {
		border-color: rgb(222, 224, 229);
	}

	.modal_botton {
		text-align: center;
		margin-top: 0;
		font-size: 32rpx;
		color: #9caac3;
		padding-top: 10rpx;
	}

	.modal_gou {
		width: 52rpx;
		height: 20rpx;
		position: absolute;
		bottom: -2rpx;
		right: -2rpx;
	}

	.modal_Agou {
		width: 51rpx;
		height: 20rpx;
		position: absolute;
		bottom: 0rpx;
		right: -54rpx;
	}


	// 优惠
	.modal-opt-btn-sale {
		width: 120rpx;
		height: 30rpx;
		border-radius: 100px;
		background-color: rgba(255, 0, 0, 1);
		position: absolute;
		// top: -40rpx;

	}

	// 提示小图标
	.modal-prompt-img {
		width: 158rpx;
		height: 45rpx;
	}

	.modal-prompt {
		width: 158rpx;
		height: 45rpx;
		position: absolute;
		right: 40rpx;
		bottom: 125rpx;
	}

	.modal-prompt-text {
		position: absolute;
		left: 0;
		top: 0;
		color: #fff;
		font-size: 16rpx;
		width: 158rpx;
		height: 45rpx;
		text-align: center;
		line-height: 36rpx;
	}
</style>
