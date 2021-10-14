<template>
	<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: red;">
		<!-- 第一个item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 66px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<!-- 左边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>
				<view style="display: flex;flex-direction: column;width: 280px;height: 45px;margin-left: 10px;">
					<text style="width: 280px;height: 15px;background-color: red;font-size: 12px;"></text>
					<text style="width: 280px;height: 15px;background-color: yellow;font-size: 12px;"></text>
					<text style="width: 280px;height: 15px;background-color: green;font-size: 12px;"></text>
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
				<view style="display: flex;flex-direction: column;width: 260px;height: 45px;margin: 0 10px;">
					<text style="width: 260px;height: 22.5px;background-color: red;font-size: 12px;"></text>
					<text style="width: 260px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
				</view>
				<!-- 右边箭头 -->
				<view style="width: 10px;height: 45px;background-color: yellow;"></view>
			</view>
			<!-- 间隔线 -->
			<view style="width: 335px;height: 1px;margin: 0px 10px;background-color: #e9e9e9;"></view>
		</view>
		
		<!-- 最后一个item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 65px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<!-- 左边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>
				<view style="display: flex;flex-direction: column;width: 205px;height: 45px;margin: 0 10px;">
					<text style="width: 205px;height: 22.5px;background-color: red;font-size: 12px;"></text>
					<text style="width: 205px;height: 22.5px;background-color: yellow;font-size: 12px;"></text>
				</view>
				<!-- 右边图片 -->
				<view style="width: 45px;height: 45px;background-color: red;"></view>	
				<!-- 右边箭头 -->
				<view style="width: 10px;height: 45px;margin-left: 10px;background-color: yellow;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	
</style>
