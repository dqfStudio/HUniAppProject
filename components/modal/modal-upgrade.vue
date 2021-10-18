<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/upgrade-bg.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-header">
					<text class="modal-content-header-text">发现新版本</text>
				</view>
				<scroll-view scroll-y="true" style="height: 240rpx;margin-top:10rpx;">
					<template v-if="type===2">
						<text class="modal-content-text">尊敬的用户：</text>
						<text class="modal-content-text">    检测到有新的版本可更新，请您杀掉进程，重新启动APP，以便完成程序升级。</text>
					</template>
					<text v-else class="modal-content-text">{{text}}</text>
				</scroll-view>
			</view>
			<view v-if="type!==2" class="modal-opt" style="justify-content:center;">
				<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalUpgrade",
		props: {
			okText: {
				type: String,
				default: '立即升级'
			},
			closeText: {
				type: String,
				default: '客服申诉'
			},
			/**
			 * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			},
			text: { // 描述内容
				type: String,
				default: ''
			},
			type: { // 升级类型 1-app壳子 2-小程序
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				timeText: ''
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false;
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
		height: 818rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}

	.modal-bg {
		width: 582rpx;
		height: 818rpx;
	}

	.modal-view {
		width: 582rpx;
		height: 818rpx;
		position: absolute;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.modal-content {
		margin-top: 392rpx;
		height: 300rpx;
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
		color: #222222;
		font-size: 28rpx;
		line-height: 60rpx;
		margin: 0 30rpx;
		/* #ifndef APP-NVUE */
		white-space: pre-wrap;
		/* #endif */
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
	}

	.modal-opt-btn-text {
		font-weight: 500;
		color: #ffffff;
		font-size: 32rpx;
	}
	
	.modal-content-header {
		height: 50rpx;
		line-height: 50rpx; 
		text-align: center;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.modal-content-header-text {
		font-weight: 600;
		color: #222222;
		font-size: 36rpx;
	}
</style>
