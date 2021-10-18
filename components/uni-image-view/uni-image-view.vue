<template>
	<view class="img" @click="handleClick" :style="{backgroundImage: `url(${getImageUrl(imgSrc)})`, backgroundSize: size}"></view>
</template>

<script>
	export default {
		name: "uniImageView",
		data() {
			return {
				imgSrc: '',
				size: 'cover'
			}
		},
		props: {
			src: {
				type: String,
				default: ""
			},
			mode: {
				type: String,
				default: "aspectFill"
			}
		},
		created() {
			switch (this.mode){
				case "scaleToFill":
					this.size = "100% 100%";
					break;
				case "aspectFit":
					this.size = "contain";
					break;
				default:
					this.size = "cover";
					break;
			}
			
			if (this.src && this.src.indexOf('.html') >= 0) {
				// 获取图片地址
				this.$config.util.getImage(this.src).then(data => {
					this.imgSrc = data;
				});
			} else {
				this.imgSrc = this.src;
			}
		},
		updated() {
			if (this.src && this.src.indexOf('.html') >= 0) {
				// 获取图片地址
				this.$config.util.getImage(this.src).then(data => {
					this.imgSrc = data;
				});
			} else {
				this.imgSrc = this.src;
			}
		},
		methods: {
			handleClick() {
				this.$emit('click');
			}
		}
	}
</script>

<style scoped>
	.img {
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
