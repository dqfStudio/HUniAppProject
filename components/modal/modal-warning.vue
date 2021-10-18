<template>
	<view class="modal">
		<image class="modal-bg" src="/static/modal/warning-bg.png" mode="aspectFill"></image>
		<image class="modal-icon" src="/static/modal/warning-icon.png" mode="aspectFill"></image>
		<view class="modal-view">
			<view class="modal-content">
				<view class="modal-content-row" style="margin-top:40rpx;">
					<text class="modal-content-text">您的账号涉嫌违规</text>
				</view>
				<view class="modal-content-row">
					<text class="modal-content-text">限制登录时间还剩{{timeText}}</text>
				</view>
			</view>
			<!-- <view class="modal-opt">
				<view class="modal-opt-btn" @click="close">
					<text class="modal-opt-btn-text">{{closeText}}</text>
				</view>
				<view class="modal-opt-btn modal-opt-btn-ok" @click="onOk">
					<text class="modal-opt-btn-text">{{okText}}</text>
				</view>
			</view> -->
			<view class="modal-opt" style="justify-content:center;">
				<view class="modal-opt-btn modal-opt-btn-ok" style="width:480rpx;" @click="onOk">
					<text class="modal-opt-btn-text">{{closeText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalWarning",
		props: {
			okText: {
				type: String,
				default: '确定'
			},
			closeText: {
				type: String,
				default: '客服申诉'
			},
			/**
			 * 倒计时时间单位秒
			 */
			time: {
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
				timeText: ''
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false;
			this.countTime();
		},
		beforeDestroy() {
			if (this.countTimeFun) {
				clearTimeout(this.countTimeFun);
			}
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
			},
			countTime() {
				if (this.time <= 0) {
					this.timeText = '';
					clearTimeout(this.countTimeFun);
					return;
				}
				
				//定义变量 d,h,m,s保存倒计时的时间  
				let d, h, m, s;
				if (this.time >= 0) {
					d = Math.floor(this.time / 60 / 60 / 24);
					h = Math.floor(this.time / 60 / 60 % 24);
					m = Math.floor(this.time / 60 % 60);
					s = Math.floor(this.time % 60);
				}
				//将0-9的数字前面加上0，例1变为01
				d = checkTime(d);
				h = checkTime(h);
				m = checkTime(m);
				s = checkTime(s);

				function checkTime(i) {
					if (i < 10) {
						i = "0" + i;
					}
					return i;
				}
				
				let text = '';
				if (d > 0) text += d + "天";
				if (h > 0 || d > 0) text += h + "时";
				if (m > 0 || d > 0 || h > 0) text += m + "分";
				if (s > 0 || this.time > 0) text += s + "秒";
				
				this.timeText = text;
				this.time--;
				//递归每秒调用countTime方法，显示动态时间效果
				this.countTimeFun = setTimeout(this.countTime, 1000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	$left: 32rpx;
	$top: 106rpx;

	.modal {
		position: relative;
		width: 646rpx;
		height: 812rpx;
		padding-left: $left;
		padding-right: $left;
		padding-top: $top;
		padding-bottom: $top;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		width: 614rpx;
		height: 706rpx;
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
		width: 214rpx;
		height: 190rpx;
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
		color: #222222;
		font-size: 32rpx;
		line-height: 60rpx;
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
</style>
