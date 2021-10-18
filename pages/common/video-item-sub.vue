<template>
	<!-- #ifdef APP-PLUS -->
	<view v-if="is_charge===2" class="item-charge">
		<image class="item-charge-img" src="/static/icon-sub-money.png" mode="heightFix"></image>
		<text class="item-charge-text">{{charge/100}}</text>
	</view>
	<!-- #endif -->
	<!-- #ifdef H5 -->
	<view v-if="is_charge===2" class="item-charge" style="background: url('/static/icon-sub-money.png') no-repeat center/cover;">
		<text class="item-charge-text">{{charge/100}}</text>
	</view>
	<!-- #endif -->
	
	<view v-else-if="is_charge===1" class="item-other">
		<image class="item-other-img" src="/static/icon-sub-free.png" mode="heightFix"></image>
	</view>
	<view v-else-if="is_charge===3" class="item-other">
		<image class="item-other-img" src="/static/icon-sub-vip.png" mode="heightFix"></image>
	</view>
	<view v-else-if="is_charge===4" class="item-other">
		<image class="item-other-img" src="/static/icon-sub-limit.png" mode="heightFix"></image>
	</view>
	<image v-else-if="is_charge===5" class="item-other" style="top: 0; right: 10rpx; height: 48rpx;" src="/static/icon-sub-trailer.png" mode="heightFix"></image>
</template>

<script>
	// 视频列表角标
	export default {
		name: "videoItemSub",
		props: {
			// 1-免费 2-收费 3-vip 4-限免 5-新片预告
			is_charge: {
				type: Number,
				default: 1
			},
			// 费用 当is_charge=2
			charge: {
				type: Number,
				default: 0
			}
		},
	}
</script>

<style scoped>
	.item-other {
		position: absolute;
		top: 6rpx;
		right: 6rpx;
		height: 30rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.item-other-img {
		height: 30rpx;
	}
	
	.item-charge {
		position: absolute;
		top: 6rpx;
		right: 6rpx;
		width: 78rpx;
		height: 30rpx;
		padding-left: 20rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		padding-left: 0;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.item-charge-img {
		width: 78rpx;
		height: 30rpx;
		position: absolute;
		left: 0;
		top: 0;
	}
	.item-charge-text {
		color:#ffffff;
		font-size: 22rpx;
		text-align: center;
		z-index: 9;
		/* #ifndef APP-NVUE */
		padding-left: 20rpx;
		/* #endif */
	}
</style>
