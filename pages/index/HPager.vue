<template>
	<!-- 导航栏 -->
	<!-- <view v-if="isNav" :style="{height:navHeight + 'px'}">
		<slot name="nav" />
	</view>
	
	<image v-if="backgroundImage.lenght" class="HPagerImageClass" mode="widthFix" :style="{'width': width+'px', 'src': backgroundImage}">
		<slot />
	</image>
	<view v-else class="HPagerClass" :style="{'width': width+'px', 'height': height+'px', 'background-color': backgroundColor}">
		<slot />
	</view> -->
</template>

<script>
	export default {
		data() {
			return {
				width: 0,
				height: 0
			}
		},
		props: {
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			backgroundImage: {
				type: String,
				default: ''
			}
		},
		created() {
			this.width  = uni.getSystemInfoSync().windowWidth;
			this.height = uni.getSystemInfoSync().windowHeight;
		}
	}
</script>

<style>
	.HPagerClass {
		display: flex;
		flex-direction: column;
	}
	.HPagerImageClass {
		position: absolute;
		z-index: 10;
	}
</style>
