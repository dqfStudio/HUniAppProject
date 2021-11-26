<template>
	<view class="tupleView">
		<HTupleViewCellHoriValue :cellHeight="120" :cellWidth="winWidth"></HTupleViewCellHoriValue>
		<HTupleViewCellHoriValue :rightImageHidden="true" :arrowHidden="true"></HTupleViewCellHoriValue>
		<!-- 第一个item -->
		<view class="cell">
			<!-- content -->
			<view class="content">
				<!-- 左边图片 -->
				<view class="leftImage"></view>
				<view class="textContent">
					<text class="text" style="background-color: red;">label</text>
					<text class="text" style="background-color: yellow;">detailLabel</text>
					<text class="text" style="background-color: green;">accessoryLabel</text>
				</view>
				<!-- 右边图片 -->
				<view class="rightImage"></view>	
				<!-- 右边箭头 -->
				<view class="arrow"></view>
			</view>
			<!-- 间隔线 -->
			<view class="separator"></view>
		</view>
		
		<!-- 中间item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<!-- 左边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>
				<view style="display: flex;flex-direction: column;width: 280px;height: 45px;margin-left: 10px;">
					<text style="width: 280px;height: 22.5px;background-color: red;font-size: 12px;"></text>
					<text style="width: 280px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
				</view>
			</view>
			<!-- 间隔线 -->
			<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
		</view>
		
		<!-- 中间item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<!-- 左边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>
				<view style="display: flex;flex-direction: column;width: 225px;height: 45px;margin: 0 10px;">
					<text style="width: 225px;height: 22.5px;background-color: red;font-size: 12px;"></text>
					<text style="width: 225px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
				</view>
				<!-- 右边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>	
			</view>
			<!-- 间隔线 -->
			<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
		</view>
		
		<!-- 中间item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 121px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 100px;margin: 10px 10px;">
				<!-- 第一个 -->
				<view style="display: flex;flex-direction: column;width: 112px;height: 100px;">
					<view style="width: 75px;height: 75px;margin: 0 16px;background-color: red;border-radius: 100%;"></view>
					<text style="width: 112px;height: 20px;padding-top: 5px;font-size: 14px;text-align: center;">黑客帝国</text>
				</view>
				<!-- 第二个 -->
				<view style="display: flex;flex-direction: column;width: 112px;height: 100px;">
					<view style="width: 75px;height: 75px;margin: 0 16px;background-color: red;border-radius: 100%;"></view>
					<text style="width: 112px;height: 20px;padding-top: 5px;font-size: 14px;text-align: center;">黑客帝国</text>
				</view>
				<!-- 第三个 -->
				<view style="display: flex;flex-direction: column;width: 111px;height: 100px;" @click="openPlayPage">
					<view style="width: 75px;height: 75px;margin: 0 16px;background-color: red;border-radius: 100%;"></view>
					<text style="width: 111px;height: 20px;padding-top: 5px;font-size: 14px;text-align: center;">黑客帝国</text>
				</view>
			</view>
			<!-- 间隔线 -->
			<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
		</view>
		
		<!-- 中间item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<text style="display: flex;align-items: center;justify-content: center;width: 112px;height: 45px;background-color: yellow;font-size: 12px;">accessoryLabel</text>
				<text style="display: flex;align-items: center;justify-content: center;width: 112px;height: 45px;background-color: green;font-size: 12px;">label</text>
				<text style="display: flex;align-items: center;justify-content: center;width: 111px;height: 45px;background-color: red;font-size: 12px;">detailLabel</text>
			</view>
			<!-- 间隔线 -->
			<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
		</view>
		
		<!-- 最后一个item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 65px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<text style="display: flex;align-items: center;justify-content: center;width: 40px;height: 45px;background-color: green;font-size: 12px;">验证码</text>
				<input style="display: flex;align-items: center;justify-content: center;width: 225px;height: 45px;background-color: red;font-size: 12px;" type="text" placeholder="请输入验证码" placeholder-style="color: white"></input>
				<text style="display: flex;align-items: center;justify-content: center;width: 70px;height: 45px;background-color: green;font-size: 12px;">获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import HTupleViewCellHoriValue from '@/pages/index/HTupleViewCellHoriValue.vue'
	import config from '@/utils/config.js'
	export default {
		components: {
			HTupleViewCellHoriValue,
		},
		data() {
			return {
				data: [],
				winWidth: 0,
                count: 30,
                showNum: 5,
                lineHeight: 60,
                // animationScroll: 800,
				animationScroll: 500,
                animation: 3000,
			}
		},
		onLoad() {
            let self = this;
            setTimeout(function(){
                self.createData();
            }, 1000);
			
			this.winWidth = uni.getSystemInfoSync().windowWidth - 20;
		},
		onReady() {
			
		},
		methods: {
			createData(){
                for(let i = 1; i <= this.count; i++){
                    this.data.push({
                        author: 'MaoUI',
                        subject: 'OnePlus手机 * ' + i + '部'
                    })
                }
            },
			openPlayPage(){
				config.util.gotoPage("/pages/index/playPage")
			}
		}
	}
</script>

<style lang="scss">
	//第一种样式写法
	.tupleView{display: flex;align-items: center;flex-direction: column;justify-content: center;background-color: red;}
	.tupleView .cell{display: flex;flex-direction: column;width: 710rpx;height: 66px;margin: 0 10px;background-color: gray;}
	.tupleView .cell .content{display: flex;flex-direction: row;width: 670rpx;height: 65px;margin: 10px 10px;}
	.tupleView .cell .content .leftImage{width: 45px;height: 45px;margin-right: 10px;background-color: red;}
	.tupleView .cell .content .textContent{display: flex;flex-direction: column;width: 410rpx;height: 45px;}
	.tupleView .cell .content .textContent .text{display: flex;align-items: center;width: 410rpx;height: 15px;font-size: 12px;}
	.tupleView .cell .content .rightImage{width: 45px;height: 45px;margin-left: 10px;background-color: red;}
	.tupleView .cell .content .arrow{width: 10px;height: 45px;margin-left: 10px;background-color: yellow;}
	.tupleView .cell .separator{width: 670rpx;height: 1px;margin: 0px 10px;background-color: #e9e9e9;}
	//第二种样式写法
	// .tupleView {
	// 	display: flex;
	// 	align-items: center;
	// 	flex-direction: column;
	// 	justify-content: center;
	// 	background-color: red;
		
	// 	.cell {
	// 		display: flex;
	// 		flex-direction: column;
	// 		width: 710rpx;
	// 		height: 66px;
	// 		margin: 0 10px;
	// 		background-color: gray;
	// 		.content {
	// 			display: flex;
	// 			flex-direction: row;
	// 			width: 670rpx;
	// 			height: 65px;
	// 			margin: 10px 10px;
	// 			.leftImage {
	// 				width: 45px;
	// 				height: 45px;
	// 				margin-right: 10px;
	// 				background-color: red;
	// 			}
	// 			.textContent {						
	// 				display: flex;
	// 				flex-direction: column;
	// 				width: 410rpx;
	// 				height: 45px;
	// 				.text {
	// 					display: flex;
	// 					align-items: center;
	// 					width: 410rpx;
	// 					height: 15px;
	// 					font-size: 12px;
	// 				}
	// 			}
	// 			.rightImage {
	// 				width: 45px;
	// 				height: 45px;
	// 				margin-left: 10px;
	// 				background-color: red;
	// 			}
	// 			.arrow {						
	// 				width: 10px;
	// 				height: 45px;
	// 				margin-left: 10px;
	// 				background-color: yellow;
	// 			}
	// 		}
	// 		.separator {						
	// 			width: 670rpx;
	// 			height: 1px;
	// 			margin: 0px 10px;
	// 			background-color: #e9e9e9;
	// 		}
	// 	}
	// }
</style>
