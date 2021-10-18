<template>
	<view v-if="navFixed&&isNav" class="page-base" :style="{minHeight:winHeight + 'px',backgroundImage: isBigBackground?'url('+backgroundImage+')':'none'}">
		<view class="nav-fixed" :style="{height:(navHeight+statusBarHeight) + 'px',backgroundImage: navBackgroundImage?'url('+navBackgroundImage+')':(!isBigBackground?'url('+backgroundImage+')':'none'), backgroundSize: navBackgroundSize}">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{height:statusBarHeight + 'px'}"></view>
			<!-- 导航栏 -->
			<view v-if="isNav" :style="{height:navHeight + 'px'}">
				<slot name="nav" />
			</view>
		</view>
		<view :style="{height:(navHeight+statusBarHeight) + 'px'}"></view>
		<!-- page-内容 -->
		<view class="page">
			<slot />
		</view>
		<!-- 底部阴影 -->
		<view class="btm-box-shadow" v-if="isBtmBoxShadow"></view>
	</view>
	<view v-else class="page-base" :style="{minHeight:winHeight + 'px', backgroundImage: 'url('+backgroundImage+')', backgroundSize: isBigBackground?'cover':'100%'}">
		<!-- 状态栏占位 -->
		<view class="statusBar" :style="{height:statusBarHeight + 'px'}"></view>
		<!-- 导航栏 -->
		<view v-if="isNav" :style="{height:navHeight + 'px'}">
			<slot name="nav" />
		</view>
		<!-- page-内容 -->
		<view class="page">
			<slot />
		</view>
		<!-- 底部阴影 -->
		<view class="btm-box-shadow" v-if="isBtmBoxShadow"></view>
	</view>
</template>

<script>
	/**
	 * PageBase 基础页面
	 * @description 基础页面-顶部背景图、底部阴影
	 * @property {Boolean} isBtmBoxShadow 底部阴影，ture-显示 false-隐藏
	 */
	export default {
		data() {
			return {
				winHeight: 0,
				statusBarHeight: 0,
				pageHeight: 0
			}
		},
		props: {
			isBtmBoxShadow: {
				type: Boolean,
				default: false
			},
			backgroundImage: {
				type: String,
				default: '/static/bg.png'
			},
			navBackgroundImage: {
				type: String,
				default: ''
			},
			navBackgroundSize: {
				type: String,
				default: '100%'
			},
			isBigBackground: { // 是否全屏
				type: Boolean,
				default: false
			},
			isNav: {
				type: Boolean,
				default: true
			},
			navHeight: {
				type: Number,
				default: 44
			},
			navFixed: {
				type: Boolean,
				default: false
			}
		},
		created() {
			const deviceInfo = uni.getSystemInfoSync();
			this.winHeight = deviceInfo.windowHeight;
			this.statusBarHeight = deviceInfo.statusBarHeight;
			this.pageHeight = deviceInfo.windowHeight - deviceInfo.statusBarHeight;
		},
		methods: {
		}
	}
</script>

<style scoped>
	.page-base {
		flex: 1;
		flex-direction: column;
		width: 750rpx;
		/* #ifndef APP-NVUE */
		background-repeat: no-repeat;
		background-size: 100%;
		display: flex;
		background-position: 0 0;
		/* #endif */
	}
	
	.bg-img {
		position: absolute;
		width: 750rpx;
	}
	.page {
		/* overflow: hidden; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* overflow-y: auto; */
		/* #endif */
		flex: 1;
	}
	.nav-fixed {
		position: fixed;
		top: 0;
		width: 750rpx;
		/* #ifndef APP-NVUE */
		background-repeat: no-repeat;
		background-size: 100%;
		/* #endif */
		background-color: #FFFFFF;
		z-index: 9;
	}
	
	.btm-box-shadow {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 1px;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
	}
</style>
