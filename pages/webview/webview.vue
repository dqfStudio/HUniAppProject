<template>
	<view>
		<view style="z-index: 99; position: fixed; top: 0; left: 0; width: 750rpx;" :style="{top: statusBarHeight+'px'}">
			<!-- <nav-base v-if="isPay" title="在线支付" leftIcon="" @clickLeft="handleCloseWebview">
				<view slot="left" style="display: flex; align-items: center;">
					<uni-icons color="#222222" type="closeempty" size="24" />
				</view>
			</nav-base>
			<nav-base v-else :title="title"></nav-base> -->
			<nav-base :title="title || webviewTitle" @clickLeft="handleCloseWebview"></nav-base>
			<!-- #ifdef H5 -->
			<web-view :style="{marginTop: '44px', height: pageHeight+'px'}" :src="url"></web-view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import http from '@/utils/request.js';
	import config from '@/utils/config.js';
	import navBase from '@/components/nav-base/nav-base.vue';
	export default {
		components: {
			navBase
		},
		data: function() {
			return {
				webviewStyles: {},
				isShowWebWiew: true,
				statusBarHeight: 0,
				url: '',
				isPay: false,
				title: "",
				webviewTitle: ""
			};
		},
		onLoad(option) {
			const deviceInfo = uni.getSystemInfoSync();
			this.winHeight = deviceInfo.windowHeight;
			this.statusBarHeight = deviceInfo.statusBarHeight;
			this.pageHeight = deviceInfo.windowHeight - deviceInfo.statusBarHeight - 44;
			
			this.title = (option && option.title) || "乐播客服";
			if (this.title === "none") {
				this.title = "";
			}
			
			if (option && option.url) {
				this.url = decodeURIComponent(option.url);
			} else if (option && option.cache && uni.getStorageSync('cacheUrl')) {
				this.url = uni.getStorageSync('cacheUrl'); // 因为参数长度有限制 所以放到本地缓存
			}
			// 是否是支付
			if (option && option.type && option.type === 'pay') {
				this.isPay = true;
				this.title = "在线支付";
			}
			
			// #ifdef APP-PLUS
			this.webview = plus.webview.create(this.url, "custom-webview", {
				plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
				height: this.pageHeight,
				top: this.statusBarHeight + 44, //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
				bottom: 0, //防止输入框被软键盘遮挡
				progress: {
					color: '#ff7f00'
				},
				// softinputMode: 'adjustResize'
			});
			this.webview.onloaded = () => {
				this.webviewTitle = this.webview.getTitle();
			}
			this.$scope.$getAppWebview().append(this.webview); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			// #endif
		},
		onHide() {
			if (this.isPay && !this.isReported && this.webview) {
				const currentUrl = this.webview.getURL();
				if (currentUrl && currentUrl.indexOf("alipay") >= 0) {
					this.isReported = true;
					// 上报调起了安卓支付
					this.$http.post({
						url: config.api.behavior,
						data: {
							type: 3, 
						},
					})
				}
			}
		},
		methods: {
			handleCloseWebview() {
				if (this.webview) this.webview.close();
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	
</style>
