<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/bind-bg-0311.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<template v-if="type===0||type===1">
					<view class="modal-content-row">
						<text class="modal-content-text" style="font-weight:500;font-size:36rpx;">您还未绑定手机号</text>
					</view>
					<view class="modal-content-row" style="padding: 0 30rpx; margin-top: 20rpx;">
						<text class="modal-content-text">切换账号可能导致账号无法找回，余额将会清零，为防止您的财产损失，建议您先绑定手机号码！</text>
					</view>
				</template>
				<template v-if="type===2">
					<view class="modal-content-row">
						<text class="modal-content-text" style="font-weight:500;font-size:36rpx;">您还未绑定手机号</text>
					</view>
					<view class="modal-content-row" style="padding: 0 30rpx; margin-top: 20rpx;">
						<text class="modal-content-text">手机号是找回账号的唯一凭证，账号丢失后余额将会清零，建议您立即绑定手机号！ </text>
					</view>
				</template>
			</view>
			<view class="modal-opt">
				<view class="modal-opt-btn modal-opt-btn-ok" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
				<view class="modal-content-row" style="margin-top: 30rpx;" @click="close">
					<text style="ont-weight:500;color:#999999;font-size:30rpx;">{{closeText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalBind",
		props: {
			okText: {
				type: String,
				default: '立即绑定'
			},
			closeText: {
				type: String,
				default: '继续切换'
			},
			/**
			 * type 类型 0-切换提示1 1-切换提示2 2-充值提示
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
	.modal {
		position: relative;
		width: 560rpx;
		height: 762rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.modal-bg {
		width: 560rpx;
		height: 762rpx;
	}
	.modal-view {
		width: 560rpx;
		height: 762rpx;
		position: absolute;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.modal-content {
		margin-top: 300rpx;
		height: 266rpx;
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
		font-size:30rpx;
		line-height:46rpx;
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
		width:336rpx;
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
