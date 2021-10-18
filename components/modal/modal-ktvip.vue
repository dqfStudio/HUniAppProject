<template>
	<view class="modal">
		<image v-if="type===0||type===3" class="modal-bg" src="/static/modal/ktvip-bg.png" mode="aspectFill"></image>
		<image v-if="type===1" class="modal-bg" src="/static/modal/vip-clarity.png" mode="aspectFill"></image>
		<image v-if="type===2" class="modal-bg" src="/static/modal/viptip-bg.png" mode="aspectFill"></image>
		<image class="modal-icon" src="/static/modal/ktvip-icon.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<!-- 提示开通vip 评论的 -->
				<template v-if="type===0">
					<view class="modal-content-row" style="margin-top:40rpx;">
						<text class="modal-content-text">开通</text>
						<text class="modal-content-text" style="color:#FF7F00;padding-left:10rpx;padding-right:10rpx;">VIP</text>
						<text class="modal-content-text">肆意抒发评论</text>
					</view>
					<view class="modal-content-row">
						<text class="modal-content-text">还有更多专享特权！</text>
					</view>
				</template>
				
				<!-- 提示开通vip 观影的 -->
				<template v-if="type===3">
					<view class="modal-content-row" style="margin-top:40rpx;">
						<text class="modal-content-text">开通</text>
						<text class="modal-content-text" style="color:#FF7F00;padding-left:10rpx;padding-right:10rpx;">VIP</text>
						<text class="modal-content-text">享无限观影</text>
					</view>
					<view class="modal-content-row">
						<text class="modal-content-text">还有更多专享特权！</text>
					</view>
				</template>
				
				<!-- vip专享画质 -->
				<template v-if="type===1">
					<view class="modal-content-row" style="margin-top:15rpx;">
						<view>
							<image style="width:140rpx;height:140rpx;" src="/static/modal/vip-clarity-img1.png" mode="aspectFill"></image>
							<text style="font-size:28rpx;text-align:center;margin-top:10rpx;">高清画质</text>
						</view>
						<text style="font-size:50rpx;color:#FF7F00;padding-left:40rpx;padding-right:40rpx;margin-bottom:40rpx;">vs</text>
						<view>
							<image style="width:140rpx;height:140rpx;" src="/static/modal/vip-clarity-img2.png" mode="aspectFill"></image>
							<text style="font-size:28rpx;color:#FF7F00;text-align:center;margin-top:10rpx;">超清画质</text>
						</view>
					</view>
				</template>
				
				<!-- vip续费提示 -->
				<template v-if="type===2">
					<view class="modal-content-row" style="margin-top:40rpx;">
						<text class="modal-content-text" style="line-height:50rpx;font-size:28rpx;">尊敬的用户，您的VIP特权已到期，</text>
					</view>
					<view class="modal-content-row">
						<text class="modal-content-text" style="line-height:50rpx;font-size:28rpx;">将不再享受</text>
						<text class="modal-content-text" style="line-height:50rpx;font-size:28rpx;color:#FF7F00;">无限观影、专享折扣</text>
					</view>
					<view class="modal-content-row">
						<text class="modal-content-text" style="line-height:50rpx;font-size:28rpx;">等优惠特权</text>
					</view>
				</template>
			</view>
			<view class="modal-opt">
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
		name: "modalKtvip",
		props: {
			okText: {
				type: String,
				default: '立即开通'
			},
			closeText: {
				type: String,
				default: '再想想'
			},
			/**
			 * type 类型 0-vip提示评论的 1-vip专享画质提示 2-vip续费提示 3-vip提示观影的
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
	$left: 42rpx;
	$top: 136rpx;
	.modal {
		position: relative;
		width: 666rpx;
		height: 872rpx;
		padding-left: $left;
		padding-right: $left;
		padding-top: $top;
		padding-bottom: $top;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		width: 624rpx;
		height: 736rpx;
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
		width: 196rpx;
		height: 247rpx;
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
		margin-top: 252rpx;
		height: 222rpx;
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
		font-size:32rpx;
		line-height:60rpx;
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
