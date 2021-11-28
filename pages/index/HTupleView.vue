<template>
	<view class="tupleView" v-for="(cell, index) in cells" :key="index">
		<!-- 第一个cell -->
		<view v-if="index == 0" class="cell0" :style="{width: cell.width+'px', height: cell.height+1+'px'}">
			<!-- content -->
			<view class="content" :style="{width: cell.contentWidth+'px', height: cell.contentHeight+'px'}">
				<!-- 左边图片 -->
				<view class="leftImage" :style="{width: cell.contentHeight+'px', height: cell.contentHeight+'px'}"></view>
				<view class="contentText" :style="{width: cell.contentTextWidth+'px', height: cell.contentHeight+'px'}">
					<text class="text" :style="{width: cell.contentTextWidth+'px', height: cell.contentHeight/3+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{width: cell.contentTextWidth+'px', height: cell.contentHeight/3+'px'}" style="background-color: yellow;">detailLabel</text>
					<text class="text" :style="{width: cell.contentTextWidth+'px', height: cell.contentHeight/3+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
				<!-- 右边图片 -->
				<view class="rightImage" :style="{width: cell.contentHeight+'px', height: cell.contentHeight+'px'}"></view>
				<!-- 右边箭头 -->
				<view class="arrow" :style="{height: cell.contentHeight+'px'}"></view>
			</view>
			<!-- 间隔线 -->
			<view class="separator" :style="{width: cell.contentWidth+'px'}"></view>
		</view>
		
		<!-- 第二个cell -->
		<view v-if="index == 1" class="cell1" :style="{width: cell.width+'px', height: cell.height+1+'px'}">
			<!-- content -->
			<view class="content" :style="{width: cell.contentWidth+'px', height: cell.contentHeight+'px'}">
				<!-- 左边图片 -->
				<view class="leftImage" :style="{width: cell.contentHeight+'px', height: cell.contentHeight+'px'}"></view>
				<view class="contentText" :style="{width: cell.contentTextWidth+'px', height: cell.contentHeight+'px'}">
					<text class="text" :style="{width: cell.contentTextWidth/3+'px', height: cell.contentHeight+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{width: cell.contentTextWidth/3+'px', height: cell.contentHeight+'px'}" style="background-color: yellow;">detailLabel</text>
					<text class="text" :style="{width: cell.contentTextWidth/3+'px', height: cell.contentHeight+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
				<!-- 右边图片 -->
				<view class="rightImage" :style="{width: cell.contentHeight+'px', height: cell.contentHeight+'px'}"></view>
				<!-- 右边箭头 -->
				<view class="arrow" :style="{height: cell.contentHeight+'px'}"></view>
			</view>
			<!-- 间隔线 -->
			<view class="separator" :style="{width: cell.contentWidth+'px'}"></view>
		</view>
		
		<!-- 第三个cell -->
		<view v-if="index == 2" class="cell2" :style="{width: cell.width+'px', height: cell.height+1+'px'}">
			<!-- accessory -->
			<text class="text" :style="{width: cell.width+'px', height: cell.accessoryHeight+'px'}">accessoryLabel</text>
			<!-- image -->
			<view style="position: relative;" :style="{width: cell.width+'px', height: cell.imageHeight+'px'}">
				<image class="image" :style="{width: cell.width+'px', height: cell.imageHeight+'px'}">
					<!-- topView -->
					<view style="position: absolute" :style="{width: cell.width+'px', height: cell.topViewHeight+'px'}">
						<image class="topView" :style="{width: cell.width+'px', height: cell.topViewHeight+'px'}">
							<text class="topText" :style="{width: cell.width+'px', height: cell.topViewHeight+'px'}">top label</text>
						</image>
					</view>
					<!-- bottomView -->
					<view style="position: absolute" :style="{top: cell.imageHeight-cell.topViewHeight+'px'  ,width: cell.width+'px', height: cell.bottomViewHeight+'px'}">
						<image class="bottomView" :style="{width: cell.width+'px', height: cell.bottomViewHeight+'px'}">
							<text class="bottomText" :style="{width: cell.width+'px', height: cell.bottomViewHeight+'px'}">bottom label</text>
						</image>
					</view>
				</image>
			</view>
			<!-- label -->
			<text class="text" :style="{width: cell.width+'px', height: cell.labelHeight+'px'}">label</text>
			<!-- detail -->
			<text class="text" :style="{width: cell.width+'px', height: cell.detailHeight+'px'}">detailLabel</text>
			<!-- 间隔线 -->
			<view class="separator" :style="{width: cell.width+'px'}"></view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cells: []
			}
		},
		onLoad() {
			this.cellStyles();
		},
		methods: {
			cellStyles() {
				let styleData0 = {
					width: uni.getSystemInfoSync().windowWidth-20,
					height: 60,
					contentWidth: 0,
					contentHeight: 0,
					contentTextWidth: 0,
					separatorSize: 10
				}
				this.cells[0] = styleData0;
				
				let styleData1 = {
					width: uni.getSystemInfoSync().windowWidth-20,
					height: 175,
					labelHeight: 25,
					detailHeight: 25,
					accessoryHeight: 25,
					imageHeight: 100,
					topViewHeight: 25,
					bottomViewHeight: 25,
				}
				this.cells[1] = styleData1;
			}
		}
	}
</script>

<style lang="scss">
	.tupleView {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background-color: red;
		.cell0 {
		    display: flex;
			flex-direction: column;
			margin: 0 10px;
			background-color: gray;
			.content {
				display: flex;
				flex-direction: row;
				margin: 10px 10px;
				.leftImage {
					margin-right: 10px;
					background-color: red;
				}
				.contentText {
					display: flex;
					flex-direction: column;
					.text {
						display: flex;
						align-items: center;
						font-size: 12px;
					}
				}
				.rightImage {
					margin-left: 10px;
					background-color: red;
				}
				.arrow {
					width: 10px;
					margin-left: 10px;
					background-color: yellow;
				}
			}
			.separator {
				height: 1px;
				margin: 0px 10px;
				background-color: #e9e9e9;
			}
		}
		.cell1 {
		    display: flex;
			flex-direction: column;
			margin: 0 10px;
			background-color: gray;
			.content {
				display: flex;
				flex-direction: row;
				margin: 10px 10px;
				.leftImage {
					margin-right: 10px;
					background-color: red;
				}
				.contentText {
					display: flex;
					flex-direction: row;
					.text {
						display: flex;
						align-items: center;
						font-size: 12px;
					}
				}
				.rightImage {
					margin-left: 10px;
					background-color: red;
				}
				.arrow {
					width: 10px;
					margin-left: 10px;
					background-color: yellow;
				}
			}
			.separator {
				height: 1px;
				margin: 0px 10px;
				background-color: #e9e9e9;
			}
		}
		.cell2 {
			display: flex;
			flex-direction: column;
			background-color: gray;
			.text {
				display: flex;
				align-items: center;
				font-size: 12px;
			}
			.image {
				position: absolute;
				background-color: white;
			}
			.topView {
				background-color: green;
				position: absolute;
			}
			.bottomView {
				background-color: green;
				position: absolute;
			}
			.topText {
				display: flex;
				align-items: center;
				font-size: 12px;
				position: absolute;
			}
			.bottomText {
				display: flex;
				align-items: center;
				font-size: 12px;
				position: absolute;
			}
			.separator {
				height: 1px;
				background-color: #e9e9e9;
			}
		}
	}
</style>