<template>
	<view class="cell" :style="{width: cellWidth+'px', height: separatorHidden?cellHeight+'px' : cellHeight+1+'px'}">
		<!-- content -->
		<view class="content" :style="{width: _contentWidth+'px', height: _contentHeight+'px'}">
			<!-- 左边图片 -->
			<view v-if="!leftImageHidden" class="leftImage" :style="{width: _contentHeight+'px', height: _contentHeight+'px'}"></view>
			<view class="textContent" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}">
				<view v-if="accessoryHidden&&detailHidden" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}">
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}" style="background-color: red;">label</text>
				</view>
				<view v-else-if="accessoryHidden" class="textContent" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}">
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/2+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/2+'px'}" style="background-color: yellow;">detailLabel</text>
				</view>
				<view v-else-if="detailHidden" class="textContent" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}">
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/2+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/2+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
				<view v-else class="textContent" :style="{width: _textContentWidth+'px', height: _contentHeight+'px'}">
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/3+'px'}" style="background-color: red;">label</text>
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/3+'px'}" style="background-color: yellow;">detailLabel</text>
					<text class="text" :style="{width: _textContentWidth+'px', height: _contentHeight/3+'px'}" style="background-color: green;">accessoryLabel</text>
				</view>
			</view>
			<!-- 右边图片 -->
			<view v-if="!rightImageHidden" class="rightImage" :style="{width: _contentHeight+'px', height: _contentHeight+'px'}"></view>
			<!-- 右边箭头 -->
			<view v-if="!arrowHidden" class="arrow" :style="{height: _contentHeight+'px'}"></view>
		</view>
		<!-- 间隔线 -->
		<view v-if="!separatorHidden" class="separator" :style="{width: _contentWidth+'px'}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				_contentWidth: 0,
				_contentHeight: 0,
				_textContentWidth: 0,
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
		watch: {
			cellWidth: {
				handler: function(newVal) {
					this._contentWidth  = newVal-20;
					this._textContentWidth = newVal-20;
				},
				immediate: true
			},
			cellHeight: {
				handler: function(newVal) {
					this._contentHeight = newVal-20;
				},
				immediate: true
			},
			leftImageHidden: {
				handler: function(newVal) {
					this._textContentWidth -= newVal?0:this.cellHeight-10;
				},
				immediate: true
			},
			rightImageHidden: {
				handler: function(newVal) {
					this._textContentWidth -= newVal?0:this.cellHeight-10;
				},
				immediate: true
			},
			arrowHidden: {
				handler: function(newVal) {
					this._textContentWidth -= newVal?0:20;
				},
				immediate: true
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
