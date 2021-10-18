<template>
	<view class="modal" @click="close" :style="{height: winHeight+'px'}">
		<!-- <image @click="onOk" class="modal-bg" src="/static/modal/gamevoucher-bg.png" mode="aspectFill"></image> -->
		<swiper class="swiper" :style="{height: winHeight+'px'}" :duration="200" :current="index" @change="handleChange">
			<swiper-item v-for="(item, index) in data">
				<!-- <image class="preview-image" :style="{height: winHeight+'px'}" :src="getImageUrl(item)" mode="aspectFit" @longpress="longpress(item)"></image> -->
				<uni-image-view class="preview-image" :style="{height: winHeight+'px'}" :src="item" mode="aspectFit"></uni-image-view>
				<!-- <movable-view :scale-max="5" :scale-min="1" :scale="true" direction="all" class="preview-image" :style="{height: winHeight+'px', backgroundImage: 'url('+item+')'}">
				</movable-view> -->
			</swiper-item>
		</swiper>
		<view class="modal-count" :style="{top: (statusBarHeight + 20) + 'px'}">
			<text>{{parseInt(index)+1}}/{{data.length}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "modalPreviewImage",
		props: {
			data: {
				type: Array,
				default: []
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				winHeight: 0,
				statusBarHeight: 0
			}
		},
		inject: ['popup'],
		created() {
			// 对话框遮罩不可点击
			// this.popup.mkclick = false
			
			const deviceInfo = uni.getSystemInfoSync();
			this.winHeight = deviceInfo.windowHeight;
			this.statusBarHeight = deviceInfo.statusBarHeight;
		},
		methods: {
			longpress() {
				// uni.showActionSheet({
				// 	itemList: ['保存图片'],
				// 	success: (res) => {
				// 		if (res.tapIndex === 0) {
							
				// 		}
				// 	},
				// });
			},
			handleChange(event) {
				this.index = event.detail.current;
			},
			// 当没有图片返回默认图片 url 资源路径
			getImageUrl(url = '') {
				if (url.indexOf('.html') >= 0) return this.$config.util.ImgDefault;
				return url || this.$config.util.ImgDefault;
			},
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
				this.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		position: relative;
		width: 750rpx;
		height: 100%;
		background-color: #000000;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.swiper {
		width: 750rpx;
	}
	.preview-image {
		width: 750rpx;
		// background-position: center;
		// background-repeat: no-repeat;
		// background-size: contain;
	}
	.modal-count {
		width: 80rpx;
		height: 40rpx;
		border-radius: 40rpx;
		background-color: rgba(0,0,0,.7);
		line-height: 40rpx;
		text-align: center;
		position: absolute;
		left: 50%;
		margin-left: -40rpx;
		z-index: 9;
		text {
			color: #fff;
			font-size: 28rpx;
		}
	}
</style>
