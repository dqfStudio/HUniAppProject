<template>
	<view class="network">
		<image class="network-icon" src="@/static/icon-nonetwork.png" mode="widthFix"></image>
		
		<view style="text-align: center; padding-top: 50rpx;">
			<text class="network-text">{{text}}</text>
		</view>
		<view class="network-btn" @click="onClickBtn">
			<text class="network-btn-text">重新加载</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "nonetwork",
		data() {
			return {

			}
		},
		props: {
			text: {
				type: String,
				default: "网络异常"
			}
		},
		methods: {
			onClickBtn() {
				this.$emit('reload');
			}
		}
	}
</script>

<style scoped>
	.network {
		/* width: 750rpx; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 200rpx;
	}

	.network-icon {
		width: 248rpx;
		height: 240rpx;
	}

	.network-text {
		color: #b4b4b4;
		font-size: 32rpx;
	}
	
	.network-btn {
		margin-top: 50rpx;
		width: 240rpx;
		height: 76rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		border-radius: 76rpx;
		background-image: linear-gradient(to right, #ffc400, #ff7f00);
	}
	.network-btn-text {
		font-weight: 500;
		color: #ffffff;
		font-size: 32rpx;
	}
</style>
