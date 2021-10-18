<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false">
			<view style="flex-direction: column;width: 200px;">
				<view style="display: flex;flex-direction: row;">
					<view class="uni-tab-item" :style="{'background-color': tabIndex==index ? 'red' : '#FFFFFF'}" v-for="(tab,index) in tabList" :key="tab.id" :id="tab.id" :ref="'tabitem'+index"
						:data-id="index" :data-current="index" @click="ontabtap">
						<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<swiper class="tab-view" :style="{height: winHeight+'px'}" :current="tabIndex" :duration="300" @change="onChangeTabPage">
			<swiper-item v-for="(tab, index) in tabList" :key="index" @touchmove.stop="stopTouchMove">
				<!-- 第一个 -->
				<template v-if="index === 0">
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
				<!-- 第二个 -->
				<template v-else>
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
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data: function() {
			return {
				winHeight: 0,
				tabBarHeight: 82,
				tabIndex: 0,
				tabList: [{'id': '1','name': '快速注册'}, {'id': '2','name': '手机注册'}],
			};
		},
		onShow() {
			
		},
		onLoad() {
			
		},
		onReady() {
			uni.getSystemInfo({
				success:  (res) => {
					this.winHeight = res.windowHeight-res.statusBarHeight-this.tabBarHeight;
				}
			});
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
			    this.isTap = true;
				this.tabIndex = index;
			},
			onChangeTabPage(e) {
				let index = e.target.current || e.detail.current;
				this.tabIndex = index;
			},
			stopTouchMove(){
				return true;
			}
		}
	};
</script>


<style>
    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */

    .tabs {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        /* height: 100vh; */
		height: 800px;
        /* #endif */
    }

    .tab-bar {
		display: flex;
		justify-content: center;
		
        width: 200px;
        height: 84rpx;
		margin: 20px 87.5px;
		
		border-radius: 42px;
		border-style: solid;
		border-color: rgb(0,0,0,0);
		overflow: hidden;
		
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
    }

    /* #ifndef APP-NVUE */
    .tab-bar ::-webkit-scrollbar {
        display: none;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
    }

    /* #endif */

    .tab-view {
        flex: 1;
		width: 375px;
		height: winHeight+'px';
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
		width: 100px;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
		display: flex;
		justify-content: center;
    }

    .uni-tab-item-title-active {
        color: #007AFF;
    }
	
	.uni-tab-item {
		
	}
	
</style>
