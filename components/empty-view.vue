<template>
	<view class="empty">
		<image class="empty-icon" src="@/static/icon-empty.png" mode="widthFix"></image>
		<text class="empty-text">{{text}}</text>
	</view>
</template>

<script>
	export default {
		name: "empty",
		data() {
			return {

			}
		},
		props: {
			text: {
				type: String,
				default: "暂无数据"
			}
		},
		methods: {}
	}
</script>

<style scoped>
	.empty {
		/* width: 750rpx; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 120rpx;
	}

	.empty-icon {
		width: 442rpx;
		height: 442rpx;
	}

	.empty-text {
		color: #b4b4b4;
		font-size: 32rpx;
	}
</style>
