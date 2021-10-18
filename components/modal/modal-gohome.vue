<template>
	<view class="modal">
		<view class="modal-qrcode">
			<canvas style="width: 170px; height: 170px; margin: 224px 0 0 67px;" canvas-id="qrcode" id="qrcode"></canvas>
			<view style="background-color: #ff7f00; border-radius: 8px; width: 304px; height: 469px; position: absolute; left: 0; top: 0;"></view>
			<canvas style="width: 304px; height: 469px; position: absolute; left: 0; top: 0;" canvas-id="qrcodeBox" id="qrcodeBox" ref="qrcodeBox"></canvas>
		</view>
		<view class="modal-opt-box">
			<image class="modal-opt-bg" src="/static/modal/gohome-bg2.png" mode="aspectFill"></image>
			<view class="modal-opt">
				<view class="modal-opt-btn" @click="onOk">
					<text class="modal-opt-btn-text">保存图片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QRCode from '@/components/tki-qrcode/qrcode.js';
	export default {
		name: "modalGohome",
		data() {
			return {
			}
		},
		inject: ['popup'],
		mounted() {
			this.$nextTick(() => {
				const userInfo = this.$store.state.userInfo;
				if (userInfo && userInfo.zb_uid) {
					this.qrcode = new QRCode({
						context: this, // 上下文环境
						canvasId: 'qrcode', // canvas-id
						usingComponents: true, // 是否是自定义组件
						showLoading: false, // 是否显示loading
						loadingText: '二维码生成中', // loading文字
						text: `${userInfo.go_home_url}?login=${userInfo.id}_${userInfo.zb_uid}_${userInfo.invite_code}`, // 生成内容
						size: 170, // 二维码大小
						background: '#ffffff', // 背景色
						foreground: '#000000', // 前景色
						pdground: '#000000', // 定位角点颜色
						correctLevel: 0, // 容错级别
						image: '/static/logo-1.png', // 二维码图标
						imageSize: 20,// 二维码图标大小
						cbResult: (qrRes) => { // 生成二维码的回调
							// 绘制圆角
							const roundRect = (ctx, x, y, w, h, r) => {
								let min_size = Math.min(w, h);
								if (r > min_size / 2) r = min_size / 2;
								// 开始绘制
								ctx.beginPath();
								ctx.moveTo(x + r, y);
								ctx.arcTo(x + w, y, x + w, y + h, r);
								ctx.arcTo(x + w, y + h, x, y + h, r);
								ctx.arcTo(x, y + h, x, y, r);
								ctx.arcTo(x, y, x + w, y, r);
								ctx.closePath();
							}
							// 绘制二维码页面
							const qrcodeBoxCtx = uni.createCanvasContext('qrcodeBox');
							// 写入背景图片
							qrcodeBoxCtx.drawImage('/static/modal/gohome-bg1.png', 0, 0, 304, 469);
							// 写入二维码
							qrcodeBoxCtx.drawImage(qrRes, 67, 230, 170, 170);
							// 
							// roundRect(qrcodeBoxCtx, 71, 398, 162, 33, 33);
							// qrcodeBoxCtx.setFillStyle('#fff2e4');
							// qrcodeBoxCtx.fill();
							// 写入文本
							qrcodeBoxCtx.setFillStyle('#333333');
							qrcodeBoxCtx.setTextAlign('left');
							qrcodeBoxCtx.setTextBaseline('top');
							qrcodeBoxCtx.font = "bold 18px sans-serif";
							qrcodeBoxCtx.fillText('乐播身份卡', 131, 60);
							qrcodeBoxCtx.setTextAlign('center');
							qrcodeBoxCtx.setTextBaseline('top');
							qrcodeBoxCtx.font = "12px sans-serif";
							qrcodeBoxCtx.fillText('下载APP：相机/扫一扫 - 扫描二维码', 152, 122);
							qrcodeBoxCtx.fillText('找回账号：我的 - 找回账号 -使用身份卡', 152, 140);
							qrcodeBoxCtx.font = "bold 16px sans-serif";
							qrcodeBoxCtx.fillText('请勿外泄给他人！', 152, 165);
							qrcodeBoxCtx.fillText(`唯一ID：${userInfo.zb_uid}`, 152, 195);
							qrcodeBoxCtx.font = "12px sans-serif";
							qrcodeBoxCtx.setFillStyle('#ff7f00');
							qrcodeBoxCtx.fillText(`网址：${userInfo.go_home_url}`, 152, 416);
							// 生成
							qrcodeBoxCtx.draw(true, () => {
								this.qrcodeBoxDrawResult = true;
							});
						},
					});
				}
			})
		},
		methods: {
			/**
			 * 点击确认按钮
			 */
			onOk() {
				if (this.qrcodeBoxDrawResult) {
					uni.canvasToTempFilePath({
						canvasId: 'qrcodeBox',
					  success: (res) => {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									uni.setStorageSync(`isHideModalGohome_${this.$store.state.userInfo.id}`, true); // 记录保存成功-下次就不弹
									uni.showToast({
										icon: 'none',
										title: '保存成功',
									});
								},
								fail: () => {
									uni.showToast({
										icon: 'none',
										title: '保存失败',
									});
								}
							})
					  },
						fail: () => {
							uni.showToast({
								icon: 'none',
								title: '保存失败',
							});
						},
					});
					
					this.$emit('confirm', () => {
						this.popup.close()
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		position: relative;
		width: 304px;
		height: 536px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
	}
	.modal-qrcode {
		width: 304px;
		height: 469px;
		position: relative;
		background-color:#ff7f00;
		border-radius: 8px;
		overflow: hidden;
	}
	.modal-opt-box {
		width: 304px;
		height: 67px;
		position: relative;
	}
	.modal-opt-bg {
		width: 304px;
		height: 67px;
	}
	.modal-opt {
		width: 304px;
		height: 65px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 2px;
	}
	.modal-opt-btn {
		width:256px;
		height:41px;
		border-radius:41px;
		background-color:#FFFFFF;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
	.modal-opt-btn-text {
		font-weight:500;
		color:#333;
		font-size:36rpx;
	}
</style>
