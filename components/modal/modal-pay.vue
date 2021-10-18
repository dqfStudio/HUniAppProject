<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/pay-bg.png" mode="aspectFill"></image>
		<image class="modal-icon" src="/static/modal/pay-icon.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-head">
					<!-- 普通用户购买支付 -->
					<template v-if="type===0||type===1">
						<text class="head-text1">开通VIP立减{{((money-vipMoney)/100).toFixed(2)}}金币</text>
						<view class="head-row">
							<view class="fgx"></view>
							<text class="head-text2">VIP仅需{{(vipMoney/100).toFixed(2)}}金币</text>
							<view class="fgx"></view>
						</view>
					</template>
					<!-- vip购买支付 -->
					<template v-if="type===2||type===3">
						<text class="head-text1">尊敬的VIP 已为您立减{{((money-vipMoney)/100).toFixed(2)}}金币</text>
						<view class="head-row">
							<view class="fgx"></view>
							<text class="head-text2" style="text-decoration: line-through;">原价{{(money/100).toFixed(2)}}金币</text>
							<view class="fgx"></view>
						</view>
					</template>
				</view>
				
				<view class="modal-content-row" style="align-items:flex-end;">
					<text class="modal-content-text" style="line-height:40rpx;">您将支付给作者</text>
					<text class="modal-content-text" style="font-size:48rpx;color:#ff7f00;">{{((isVip?vipMoney:money)/100).toFixed(2)}}</text>
					<text class="modal-content-text" style="line-height:40rpx;">金币</text>
				</view>
				<text class="modal-content-text">用于购买视频！</text>
				<view class="modal-content-row" style="margin-top:10rpx;">
					<text class="modal-content-text" style="font-size:32rpx;color:#9caac3;">当前余额：</text>
					<text class="modal-content-text" style="color:#9caac3;">{{(balance/100).toFixed(2)}}金币</text>
				</view>
			</view>
			
			<view v-if="type===1||type===3" class="modal-opt" style="justify-content:center;">
				<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
			</view>
			<view v-else class="modal-opt">
				<view class="modal-opt-btn" @click="close">
					<text class="modal-opt-btn-text">{{closeText}}</text>
				</view>
				<view class="modal-opt-btn modal-opt-btn-ok" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalPay",
		props: {
			isVip: {
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
			balance: {
				type: Number,
				default: 0
			},
			okText: {
				type: String,
				default: '确定'
			},
			closeText: {
				type: String,
				default: '再想想'
			},
			/**
			 * type 类型 0-普通用户余额足 1-普通用户余额不足 2-vip用户余额足 3-vip用户余额不足
			 */
			type: {
				type: Number,
				default: 0
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
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			// this.popup.mkclick = false
		},
		methods: {
			/**
			 * 点击确认按钮
			 */
			onOk() {
				this.$emit('confirm', () => {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	$left: 34rpx;
	$top: 62rpx;
	.modal {
		position: relative;
		width: 650rpx;
		height: 724rpx;
		padding-left: $left;
		padding-right: $left;
		padding-top: $top;
		padding-bottom: $top;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		width: 616rpx;
		height: 662rpx;
		margin-left: -$left;
		margin-top: -$top;
		padding-right: 0;
		padding-bottom: 0;
		/* #endif */
	}
	.modal-bg {
		width: 582rpx;
		height: 600rpx;
	}
	.modal-icon {
		width: 144rpx;
		height: 150rpx;
		position: absolute;
		top: 0;
		left: 0;
	}
	.modal-view {
		width: 582rpx;
		height: 600rpx;
		position: absolute;
		left: $left;
		top: $top;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.modal-content {
		margin-top: 130rpx;
		height: 342rpx;
		text-align: center;
	}
	.modal-content-row {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.modal-content-text {
		color:#222222;
		font-size:28rpx;
		line-height:50rpx;
		text-align: center;
	}
	.modal-content-head {
		height: 140rpx;
		text-align: center;
	}
	.head-text1 {
		font-weight:500;
		color:#ffffff;
		font-size:32rpx;
		text-align:center;
		line-height: 50rpx;
		margin-top: 15rpx;
	}
	.head-text2 {
		font-weight:500;
		color:#ffffff;
		font-size:24rpx;
		text-align:center;
		line-height: 50rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
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
		width:242rpx;
		height:76rpx;
		border-radius:76rpx;
		background-color:#c2cce0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
	.modal-opt-btn-ok {
		background-image:linear-gradient(to right,#ffc400,#ff7f00);
	}
	.modal-opt-btn-text {
		font-weight:500;
		color:#ffffff;
		font-size:32rpx;
	}
</style>
