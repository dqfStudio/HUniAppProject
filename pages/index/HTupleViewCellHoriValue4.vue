<template>
	<view class="cell" :style="{width: cellWidth+'px', height: separatorHidden?cellHeight+'px' : cellHeight+1+'px'}">
		<!-- content -->
		<view class="content" :style="{width: cellWidth+'px', height: cellHeight+'px'}">
			<!-- 左边图片 -->
			<view v-if="!leftImageHidden" class="leftImage" :style="{width: cellHeight-20+'px', height: cellHeight-20+'px'}"></view>
			<view class="textContent" :style="{width: cellWidth-20-(leftImageHidden?0:cellHeight-10)-(rightImageHidden?0:cellHeight-10)-(arrowHidden?0:20)+'px', height: cellHeight-20+'px'}">
				<view v-if="accessoryHidden&&detailHidden">
					<text class="text" :style="{height: cellHeight-20+'px'}" style="background-color: red;">label</text>
				</view>
				<view v-else-if="accessoryHidden" class="textContent">
					<text class="text" :style="{height: (cellHeight-20)/2+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{height: (cellHeight-20)/2+'px'}" style="background-color: yellow;">detailLabel</text>
				</view>
				<view v-else-if="detailHidden" class="textContent">
					<text class="text" :style="{height: (cellHeight-20)/2+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{height: (cellHeight-20)/2+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
				<view v-else class="textContent">
					<text class="text" :style="{height: (cellHeight-20)/3+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{height: (cellHeight-20)/3+'px'}" style="background-color: yellow;">detailLabel</text>
					<text class="text" :style="{height: (cellHeight-20)/3+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
			</view>
			<!-- 右边图片 -->
			<view v-if="!rightImageHidden" class="rightImage" :style="{width: cellHeight-20+'px', height: cellHeight-20+'px'}"></view>
			<!-- 右边箭头 -->
			<view v-if="!arrowHidden" class="arrow" :style="{height: cellHeight-20+'px'}"></view>
		</view>
		<!-- 间隔线 -->
		<view v-if="!separatorHidden" class="separator" :style="{width: cellWidth-20+'px'}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			cellWidth: {
				type: Number,
				default: 355
			},
			cellHeight: {
				type: Number,
				default: 65
			},
			leftImageHidden: {
				type: Boolean,
				default: false
			},
			rightImageHidden: {
				type: Boolean,
				default: false
			},
			arrowHidden: {
				type: Boolean,
				default: false
			},
			separatorHidden: {
				type: Boolean,
				default: false
			},
			detailHidden: {
				type: Boolean,
				default: false
			},
			accessoryHidden: {
				type: Boolean,
				default: false
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.cell {
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
			.textContent {
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
</style>
