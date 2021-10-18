<template>
	<view class="uni-popup-dialog">
		<view v-if="isClose" @click="close" class="uni-dialog-close">
			<uni-icons type="closeempty" color="#999" size="20"></uni-icons>
		</view>
		<view class="uni-dialog-content">
			<text v-if="content" class="uni-dialog-content-text">{{content}}</text>
			<slot />
			<!-- <slot name="content" /> -->
		</view>
		<view v-if="isFooter" class="uni-dialog-button-group">
			<view v-if="closeText!=='none'" class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">{{closeText}}</text>
			</view>
			<view v-if="okText!=='none'" class="uni-dialog-button uni-border-right" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">{{okText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 自定义公用弹框
	 * @description 弹出层-对话框样式
	 * @property {Boolean} isClose 是否关闭按钮
	 * @property {String} content 对话框内容
	 * @property {String} okText 确定按钮文本 none-表示不显示
	 * @property {String} closeText 关闭按钮文本 none-表示不显示
	 * @property {Boolean} isFooter 是否显示按钮
	 * @property {Boolean} beforeClose 是否拦截取消事件
	 * @event {Function} confirm 点击确认按钮触发
	 * @event {Function} close 点击取消按钮触发
	 */

	export default {
		name: "modalDialog",
		props: {
			okText: {
				type: String,
				default: '确定'
			},
			closeText: {
				type: String,
				default: '取消'
			},
			isClose: {
				type: Boolean,
				default: false
			},
			isFooter: {
				type: Boolean,
				default: true
			},
			/**
			 * 对话框内容
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			},
			// 是否可以点击遮罩关闭
			maskClickClose: {
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
			this.popup.mkclick = this.maskClickClose || false
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
	.uni-popup-dialog {
		width: 600rpx;
		border-radius: 16rpx;
		background-color: #fff;
		position: relative;
	}
	
	.uni-dialog-close {
		position: absolute;
		right: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
	}

	.uni-dialog-content-text {
		font-size: 30rpx;
		color: #333;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		border-bottom-left-radius: 16rpx;
	}

	.uni-border-right {
		border-left-color: #f5f5f5;
		border-left-style: solid;
		border-left-width: 1px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 16rpx;
	}

	.uni-dialog-button-text {
		font-size: 32rpx;
		color: #999;
		font-weight: 500;
	}

	.uni-button-color {
		color: #ff7f00;
	}
</style>
