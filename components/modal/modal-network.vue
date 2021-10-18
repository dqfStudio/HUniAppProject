<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/network-bg.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<text class="modal-content-text">我滴神呐！断网了～</text>
			</view>
			
			<view class="modal-opt" style="justify-content:center;">
				<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalNetwork",
		props: {
			okText: {
				type: String,
				default: '重新加载'
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
			this.popup.mkclick = false
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
		width: 582rpx;
		height: 690rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.modal-bg {
		width: 582rpx;
		height: 690rpx;
	}
	.modal-view {
		width: 582rpx;
		height: 690rpx;
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		margin-top: 420rpx;
		height: 100rpx;
	}
	.modal-content-text {
		color:#222222;
		font-weight:500;
		font-size:32rpx;
		line-height:40rpx;
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
