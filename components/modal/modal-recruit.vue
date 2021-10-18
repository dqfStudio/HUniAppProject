<template>
	<view class="modal">
		<image class="modal-bg" src="/static/other/recruit/recruit-tk.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-row">
					<text class="modal-content-text" style="font-weight:500;font-size:36rpx;">投稿方式</text>
				</view>
				<view class="modal-content-row" style="padding: 0 30rpx; margin-top: 20rpx;">
					<text class="modal-content-text" style="text-align: center;">尊敬的乐播用户，编剧投稿、应聘演员请把资料发送至邮箱{{email}}，乐播客服会在第一时间与您取得联系！</text>
				</view>
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
		name: "modalRecruit",
		props: {
			okText: {
				type: String,
				default: '复制邮箱'
			},
			closeText: {
				type: String,
				default: '忽略'
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
				email: "lebo.live@yandex.com"
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
				uni.setClipboardData({
					data: this.email,
					success: () => {
						uni.showToast({
							title: '邮箱复制成功',
							duration: 2000
						});
						this.popup.close()
					},
					fail: () => {
						uni.showToast({
							title: '邮箱复制失败',
							duration: 2000
						});
					}
				});
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
		width: 630rpx;
		height: 840rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.modal-bg {
		width: 630rpx;
		height: 840rpx;
	}
	.modal-view {
		width: 630rpx;
		height: 840rpx;
		position: absolute;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	.modal-content {
		margin-top: 408rpx;
		height: 250rpx;
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
