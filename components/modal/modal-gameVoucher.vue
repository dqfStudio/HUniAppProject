<template>
	<view class="modal">
		<image @click="onOk" class="modal-bg" src="/static/modal/gamevoucher-bg.png" mode="aspectFill"></image>
		<!-- <view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-voucher">
					<view class="modal-content-voucher-money">
						<view class="modal-content-row" style="height:50rpx;margin-bottom:5rpx;">
							<text style="font-weight:500;color:#ffffff;font-size:48rpx;letter-spacing:-1px;">{{money}}</text>
							<text style="font-weight:600;color:#ffffff;font-size:24rpx;align-self:flex-end;padding-bottom:8rpx;">元</text>
						</view>
						<text style="font-weight:500;color:#ffffff;font-size:22rpx;">游戏券</text>
					</view>
					<view class="modal-content-voucher-tip">
						<view class="modal-content-row">
							<text style="font-size:22rpx;color:#ff8100;">充值</text>
							<text style="font-size:22rpx;color:#ff8100;font-weight:500;">100</text>
							<text style="font-size:22rpx;color:#ff8100;">送</text>
							<text style="font-size:22rpx;color:#ff8100;font-weight:500;">100</text>
						</view>
						<view class="modal-content-row">
							<text style="font-size:22rpx;color:#ff8100;">充值</text>
							<text style="font-size:22rpx;color:#ff8100;font-weight:500;">1000</text>
							<text style="font-size:22rpx;color:#ff8100;">送</text>
							<text style="font-size:22rpx;color:#ff8100;font-weight:500;">1000</text>
						</view>
						<text style="font-size:26rpx;color:#ff8100;">充值多少送多少</text>
					</view>
				</view>
				<view class="modal-content-row" style="margin-top: 20rpx;">
					<text style="font-weight:500;color:#ff8300;font-size:22rpx;">游戏券未使用，联系客服立即使用 ～</text>
				</view>
			</view>
			<view class="modal-opt">
				<view class="modal-opt-btn" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
				<view class="modal-content-row" style="margin-top: 30rpx;" @click="close">
					<text style="ont-weight:500;color:#999999;font-size:30rpx;">{{closeText}}</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: "modalGameVoucher",
		props: {
			okText: {
				type: String,
				default: '立即使用'
			},
			closeText: {
				type: String,
				default: '狠心离开'
			},
			money: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				qrcodeVal: ''
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
				this.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		position: relative;
		width: 576rpx;
		height: 648rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.modal-bg {
		width: 576rpx;
		height: 648rpx;
	}
	.modal-view {
		width: 560rpx;
		height: 754rpx;
		position: absolute;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.modal-content {
		// height: 562rpx;
		height: 244rpx;
		padding-top: 318rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		// justify-content: space-between;
	}
	.modal-content-voucher {
		width: 464rpx;
		height: 160rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.modal-content-voucher-money {
		width: 196rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.modal-content-voucher-tip {
		margin-right: 30rpx;
		margin-bottom: 12rpx;
		width: 244rpx;
		height: 110rpx;
		color:#ff8100;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
		width: 400rpx;
		height: 56rpx;
		line-height: 56rpx;
		color:#222222;
		background-color:#ff7f00;
		border-radius:56rpx;
		font-weight:500;
		color:#ffffff;
		font-size:32rpx;
		text-align: center;
	}
	.modal-opt {
		padding: 0 30rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
	.modal-opt-btn {
		width:376rpx;
		height:75rpx;
		border-radius:75rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background-image:linear-gradient(to right,#ffc400,#ff7f00);
	}
	.modal-opt-btn-text {
		font-weight:600;
		color:#ffffff;
		font-size:36rpx;
	}
</style>
