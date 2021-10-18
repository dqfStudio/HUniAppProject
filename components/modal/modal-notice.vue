<template>
	<view class="modal">
		<image style="width: 582rpx; height: 252rpx; border-top-left-radius: 36rpx; border-top-right-radius: 36rpx;" src="@/static/modal/notice-bg-0418.png" mode="widthFix"></image>
		<view class="modal-content">
			<scroll-view scroll-y="true" style="max-height: 420rpx;" :style="{maxHeight: conMaxHeight + 'px'}">
				<view style=" padding: 0 40rpx;">
					<!-- <text class="modal-content-text">{{contentText}}</text> -->
					<text class="modal-content-text" v-html="contentText"></text>
				</view>
			</scroll-view>
		</view>
		
		<view class="modal-opt" style="justify-content:center; margin-top: 40rpx; margin-bottom: 40rpx;">
			<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
				<text class="modal-opt-btn-text">{{okText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalNotice",
		props: {
			okText: {
				type: String,
				default: '知道了'
			},
			contentText: {
				type: String,
				default: ''
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
				conMaxHeight: 200, // 内容最高高度
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			// this.popup.mkclick = false
			
			 this.conMaxHeight = (parseInt(uni.getSystemInfoSync().windowHeight) * 0.8) - 80 - 130;
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
		// height: 858rpx;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		width: 582rpx;
		// height: 858rpx;
		/* #endif */
		background-color: #fff;
		border-radius: 36rpx;
	}
	.modal-bg {
		width: 582rpx;
		height: 858rpx;
	}
	.modal-view {
		width: 582rpx;
		height: 858rpx;
		position: absolute;
		left: 0;
		top: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.modal-content {
		padding-top: 30rpx;
	}
	.modal-content-text {
		color:#222222;
		font-size:30rpx;
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
