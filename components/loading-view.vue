<template>
  <view>
    <view class="loading-bg" v-if="mask"></view>
    <view class="loading" :class="position==='center'&&'loading-center'">
      <view class="loading-box">
        <image class="loading-icon" :src="icon" mode="widthFix"></image>
      </view>
      <text v-if="isText" class="loading-text">{{text}}</text>
    </view>
  </view>
</template>

<script>
	export default {
		name: "loading",
		data() {
			return {
				// laodingIcon: loadingImg
			}
		},
		props: {
			text: {
				type: String,
				default: "数据加载中..."
			},
			icon: {
				type: String,
				default: "/static/loading.gif"
			},
			isText: {
				type: Boolean,
				default: false
			},
      mask: {
        type: Boolean,
        default: false
      },
			position: {
				type: String,
				default: '' // center
			},

		},
		methods: {}
	}
</script>

<style scoped>
.loading-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, .5)
}
	.loading {
    position: relative;
    z-index: 999;
		/* width: 750rpx; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 300rpx;
	}
	.loading-center {
		padding: 0;
		flex: 1;
	}
	
	.loading-box{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.loading-icon {
		width: 100rpx;
		height: 100rpx;
	}

	.loading-text {
		color: #b4b4b4;
		font-size: 28rpx;
	}
</style>
