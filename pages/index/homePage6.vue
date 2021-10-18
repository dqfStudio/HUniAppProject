<template>
	<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: red;">
		<!-- 第一个item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 65px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<text style="display: flex;align-items: center;justify-content: center;width: 40px;height: 45px;background-color: green;font-size: 12px;">+86</text>
				<input style="display: flex;align-items: center;justify-content: center;width: 295px;height: 45px;background-color: red;font-size: 12px;" type="text" placeholder="请输入手机号" placeholder-style="color: white"></input>
			</view>
		</view>
		
		<!-- 中间item -->
		<view style="display: flex;flex-direction: column;width: 355px;height: 65px;margin: 0 10px;background-color: gray;">
			<!-- content -->
			<view style="display: flex;flex-direction: row;width: 335px;height: 65px;margin: 10px 10px;">
				<text style="display: flex;align-items: center;justify-content: center;width: 40px;height: 45px;background-color: green;font-size: 12px;">昵称</text>
				<input style="display: flex;align-items: center;justify-content: center;width: 295px;height: 45px;background-color: red;font-size: 12px;" type="text" placeholder="请输入昵称" placeholder-style="color: white"></input>
			</view>
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
